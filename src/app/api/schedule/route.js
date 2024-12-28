import db from "@/db";
export async function GET(request) {
    try {
    const { searchParams } = new URL(request.url);
    const selectedDate = searchParams.get('date');
    
        const [conferences] = await db.query(
            `
            SELECT 
                c.id AS conference_id,
                c.name AS conference_name,
                c.conf_description,
                c.location,
                c.start_date,
                c.end_date,
                s.id AS session_id,
                s.agenda,
                s.presentation_topics,
                s.speaker,
                s.start_time,
                s.end_time,
                s.live_streaming_link,
                s.recording_link
            FROM 
                conferences c
            LEFT JOIN 
                sessions s ON c.id = s.conference_id
            WHERE 
                DATE(s.start_time) = ? OR DATE(s.end_time) = ?
            ORDER BY 
                c.start_date, s.start_time
            `,
            [selectedDate, selectedDate]
        );

        const conferencesWithSessions = {};

        // Group sessions under their respective conferences
        conferences.forEach((conf) => {
            if (!conferencesWithSessions[conf.conference_id]) {
                conferencesWithSessions[conf.conference_id] = {
                    conference_id: conf.conference_id,
                    name: conf.conference_name,
                    description: conf.conf_description,
                    location: conf.location,
                    start_date: conf.start_date,
                    end_date: conf.end_date,
                    sessions: [],
                };
            }

            if (conf.session_id) {
                conferencesWithSessions[conf.conference_id].sessions.push({
                    session_id: conf.session_id,
                    agenda: conf.agenda,
                    speaker: conf.speaker,
                    presentation_topics: conf.presentation_topics,
                    start_time: conf.start_time,
                    end_time: conf.end_time,
                    live_streaming_link: conf.live_streaming_link,
                    recording_link: conf.recording_link,
                });
            }
        });

        // Convert the grouped object to an array
        const responseData = Object.values(conferencesWithSessions);

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching conference sessions:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch conference sessions' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}