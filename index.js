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

async function displayActivity(events) {

    if (events.length === 0) {
        console.log(
          'No recent activity found for this user.'
        );
        return;
    }

    for (const element of events) {
            console.log(`Type: ${element.type}`);
            console.log(`Repo: ${element.repo.name}`);
            console.log(`Date: ${element.created_at}`);
            if (element.type === 'PushEvent') {
                const repoName = element.repo.name;

                const before =
                    element.payload.before;

                const head =
                    element.payload.head;

                const url =
                  `https://api.github.com/repos/${repoName}/compare/${before}...${head}`;

                const response =
                    await fetch(url);

                const data =
                    await response.json();

                const commitCount =
                    data.total_commits || 0;
                console.log(`pushed: ${commitCount}`);

                for (let i = 0; i < commitCount; i++) {
                    const message =
                        data.commits[i].commit.message;
                    console.log(`- Commit ${i + 1}: ${message}`);
                }
            }
            console.log('---------------------------------');
        };
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
