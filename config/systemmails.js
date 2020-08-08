exports.register = name => `  <h1>Travel Stories <i class="fas fa-mountain"></i></h1>
                            <h3>Share your stories <i class="fas fa-plane"></i></h3>
                            <h2 style="margin:10px; border-bottom:2px solid black">Welcome, ${name}!</h2>
                            <h3 style="margin-bottom:10px;">Great, to have you on board!</h3>
                            <div style="display: grid; width: 100%; height: 50%; grid-template: repeat(3, 1fr) / repeat(2, 1fr); grid-gap: 5px; align-items:center; justify-content:center;">
                                <div style="background-color:yellow; width:100%; height:100%; display: flex; align-items:center; justify-content:center;"><i class="fas fa-search icon"></i></div>
                                <div style="background-color:rgb(250, 250, 198); width:100%; height:100%; display: flex; align-items:center; justify-content:center;"><i class="fas fa-share-alt-square icon"></i></div>
                                <div style="background-color:rgb(145, 126, 255); width:100%; height:100%; display: flex; align-items:center; justify-content:center;"><i class="fas fa-network-wired icon"></i></div>
                                <div style="background-color:rgb(54, 197, 154); width:100%; height:100%; display: flex; align-items:center; justify-content:center;"><i class="fas fa-cloud icon"></i></div>
                                <div style="background-color:rgb(255, 221, 126); width:100%; height:100%; display: flex; align-items:center; justify-content:center;"><i class="fas fa-play icon"></i></div>
                                <div style="background-color:rgb(255, 135, 126); width:100%; height:100%; display: flex; align-items:center; justify-content:center;"><i class="fas fa-users icon"></i></div>
                            </div>
                        `;

const status = {
    "no-request":["Friendship or request canceled","User:"],
    "request-accepted":["Your friendship request was accepted!","Your new friend:"],
    "request-made-by-other":["Friendship or request canceled","User:"],
    "request-made-by-myself":["You have a new friendship request! Have a look!","User:"]
};

exports.friendrequest = (name,request,other) => `<h1>Travel Stories <i class="fas fa-mountain"></i></h1>
                                            <h3>Share your stories <i class="fas fa-plane"></i></h3>
                                            <h2 style="margin:10px; border-bottom:2px solid black">Hello, ${other}!</h2>
                                            <h3 style="margin-bottom:10px;">${status[request][0]}</h3>
                                            <h3 style="margin-bottom:10px;">${status[request][1]} ${name}</h3>
                                            <h2 style="margin-bottom:10px;">Enjoy your day!</h2>
                                            `;