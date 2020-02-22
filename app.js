
// init button for get User Name
document.querySelector('#get_user').addEventListener('click', showUserProfile);



async function showUserProfile() {
    // remove previous profile
    document.querySelector('#user_profile').innerHTML = '';
    document.querySelector('#user_repositories').innerHTML = null;

    // get User Name
    let userName = getUserName();

    if (userName) {

        

               // get github profile by user`s name
        let githubResponse = await fetch(`https://api.github.com/users/${userName}`);
        let githubUser = await githubResponse.json();

        if (githubUser.login) {

            // Show User Profile


            console.log(githubUser);

            document.querySelector('#user_profile').innerHTML = `
    
    <div class="card card-body my-3">
            <div class="row">
                <div class="col-md-3">
                    <img class="img-fluid mb-2" src="${githubUser.avatar_url}" alt="">
                    <h5 class="card-title mb-2">${getProfileData(githubUser.login)}</h5>
                    <a href="${githubUser.html_url}" target="_blank"
                     class="btn btn-info btn-block mb-4">Show Profile Info</a>
                </div>

                <div class="col-md-9">
                    <span class="badge badge-primary">Public Repos: ${githubUser.public_repos}</span>
                    <span class="badge badge-secondary">Public Gists: ${githubUser.public_gists}</span>
                    <span class="badge badge-success">Followers: ${githubUser.followers}</span>
                    <span class="badge badge-info">Following: ${githubUser.following}</span>
                    <br><br>
                    <ul class="list-group">
                     <li class="list-group-item">Company: ${getProfileData(githubUser.company)}</li>
                     <li class="list-group-item">Website/Blog: ${getProfileData(githubUser.blog)}</li>
                     <li class="list-group-item">Location: ${getProfileData(githubUser.location)}</li>
                     <li class="list-group-item">Member Since: ${githubUser.created_at}</li>
                  </ul>
                </div>
            </div>
    </div>
    
    `;

    // Show User Repositories
    let reposQuantity = 5;
    let sortOption = 'created: asc';
    
    // should know github api features: we can manage quantity of repositories and sort them
    let reposResponse = await fetch(`https://api.github.com/users/${userName}/repos?per_page=${reposQuantity}&sort=${sortOption}`);
    let userRepos = await reposResponse.json();
    
    let reposRender = '<h3 class="page-heading mb-3">Latest Repos</h3>';
    

    
        userRepos.forEach( repo => {
            reposRender += `
                <div class="card card-body my-2">
                    <div class="row">

                    <div class="col-md-6">
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                    </div>

                    <div class="col-md-6">
                        <span class="badge badge-primary">Watchers: ${repo.watchers_count}</span>
                        <span class="badge badge-secondary">Stars: ${repo.stargazers_count}</span>
                    </div>
                    
                    </div>
                </div>
            
            `;
            
            
        })

        // reposQuantity--;
    
    document.querySelector('#user_repositories').innerHTML = reposRender;
       
    console.log( userRepos)

    } else {
        // if github user name is not exist:
        createUserNotExistAlert(userName);

    }


    } else {
        // Input field is empty: we show alert during 3s
        createEmptyNameAlert();

    }
}

/* FUNCTIONS */

// get data into profile object
// githup api often return 'null' when data is not specified
// so, we change 'null' to empty string
function getProfileData(data) {
    return data == null ? '' : data;
}

function getUserName() {
    let userName = document.querySelector('#user_name').value;
    // clear input field
    document.querySelector('#user_name').value = '';
    return userName;
}


 // Input field is empty: we show alert during 3s
async function createEmptyNameAlert() {
    document.querySelector('#user_profile').innerHTML = `
        <div class="alert alert-danger my-3">
            <strong>Warning!</strong> User name is required!
        </div>`;
    

await new Promise((resolve, reject) => {
    setTimeout(resolve, 3000)
});

document.querySelector('#user_profile').innerHTML = null;
}

// if github user name is not exist:
async function createUserNotExistAlert(nonexistentName) {
    document.querySelector('#user_profile').innerHTML = `

            <div class="alert alert-secondary text-info my-3">
                <strong>Warning!</strong> User: " ${nonexistentName.toUpperCase()} " is not exist!
            </div>
        `;

        await new Promise( (resolve, reject) => {
            setTimeout( resolve, 3000);
        });

        document.querySelector('#user_profile').innerHTML = null;
}