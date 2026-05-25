async function fetchGithubActivity(username) {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('User not found');
        }
        else {
            throw new Error('Failed to fetch data from GitHub API: ' + response.statusText);
        }
    }
     return response.json();
}

function displayActivity(events){
    if (events.length === 0) {
        console.log('No recent activity found for this user.');
        return;
    }

    events.forEach(event => {
        let action;
        console.log(event.payload);
        switch (event.type) {
            case "PushEvent":
                

                break;
            case "IssuesEvent":
                action = `${event.payload.action} an issue in ${event.repo.name}`;
                break;
            case "WatchEvent":
                action = `starred ${event.repo.name}`;
                break;
            case "ForkEvent":
                action = `forked ${event.repo.name}`;
                break;
            case "CreateEvent":
                action = `created ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`;
                break;
            default:
                action = `performed ${event.type} in ${event.repo.name}`;
                break;
        }
        console.log(`- ${action}`);
    });
}
    const username = process.argv[2];
    if (!username) {
        console.error('Please provide a GitHub username as an argument.');
        process.exit(1);
    }

    fetchGithubActivity(username)
        .then((events) => {
            displayActivity(events);
        })
        .catch((error) => {
            console.error('Error:', error.message);
            process.exit(1);
        });
