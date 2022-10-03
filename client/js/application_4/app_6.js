
addLight = (a, b, c, d) => {
    const home = document.getElementById('home'), newGame = document.getElementById('new'), chal = document.getElementById('chal'), help = document.getElementById('help');
    if (a.toString() !== '') { home.classList.remove('text-dark'); home.classList.add('text-primary'); }
    else { home.classList.remove('text-primary'); home.classList.add('text-dark'); }
    if (b.toString() !== '') { newGame.classList.remove('text-dark'); newGame.classList.add('text-primary'); }
    else { newGame.classList.remove('text-primary'); newGame.classList.add('text-dark'); }
    if (c.toString() !== '') { chal.classList.remove('text-dark'); chal.classList.add('text-primary'); }
    else { chal.classList.remove('text-primary'); chal.classList.add('text-dark'); }
    if (d.toString() !== '') { help.classList.remove('text-dark'); help.classList.add('text-primary'); }
    else { help.classList.remove('text-primary'); help.classList.add('text-dark'); }
}

Template.home.rendered = () => {
    addLight('x', '', '', ''); Session.set('email', '');
    Session.set('GameChoice2', 'none');
    Session.set('GameChoice3', 'none');
    // loadNext();
}

Template.new.rendered = () => { addLight('', 'y', '', ''); Session.set('email', ''); }

Template.challenge.rendered = () => {
    addLight('', '', 'z', ''); Session.set('email', '');
    Session.set('chalPane', 'true');
    Session.set('showCloseMenu', 'false');

    if (Session.get('inChallenge') === 'true') {
        Session.set('showActiveChallenge', 'true');
        Session.set('startNew', 'false');
        Session.set('showDetailsPane', 'false');
    }
    else {
        Session.set('showActiveChallenge', 'false');
        Session.set('startNew', 'true');
        Session.set('showDetailsPane', 'false');
    }
    // check the current use =r challenge status
    loadChallengeStatus();
}

Template.help.rendered = () => { addLight('', '', '', 'w'); Session.set('email', ''); }

Template.menu.events({
    'click #open-sidebar': () => {
        let sidenav = document.getElementById("sidenav"),
            overlay = document.getElementById("woh-overlay");
        // icon = document.getElementById("icon-menu");

        if (sidenav.style.display === 'none' || overlay.style.display === 'none') {
            sidenav.style.display = "block"; sidenav.style.left = "0px";
            overlay.style.display = "block";
            // icon.classList.remove('fa-bars');
            // icon.classList.add('fa-times'); icon.classList.add('text-danger');
            Session.set('showCloseMenu', 'true');
        }
        else {
            // icon.classList.remove('fa-times');
            // icon.classList.remove('text-danger');
            // icon.classList.add('fa-bars');
            sidenav.style.display = "none";
            overlay.style.display = "none";
            // add animation to menu bar once it is closed
            // animateIcon(icon);
            Session.set('showCloseMenu', 'false');
        }
    }
});

Template.sidebar.events({
    'click #woh-overlay': () => {
        let sidenav = document.getElementById("sidenav"), overlay = document.getElementById("woh-overlay");
        // icon = document.getElementById("icon-menu");

        sidenav.style.display = "none"; overlay.style.display = "none";
        // icon.classList.remove('fa-times'); icon.classList.remove('text-danger'); icon.classList.add('fa-bars');
        Session.set('showCloseMenu', 'false');
        // animateIcon(icon);
    }
});

Session.set('showCloseMenu', 'false');

Template.menu.helpers({
    'showCloseMenu': () => {
        if (Session.get('showCloseMenu') === 'true') { return true; }
        return false;
    }
});

Template.notFound.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.deposit.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.withdraw.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.history.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.account.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.login.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.signup.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.reset.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.update.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.terms.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.contact.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.share.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.settings.created = () => { addLight('', '', '', ''); Session.set('showCloseMenu', 'false'); }
Template.home.created = () => { Session.set('showCloseMenu', 'false'); }
Template.new.created = () => { Session.set('showCloseMenu', 'false'); }
Template.help.created = () => { Session.set('showCloseMenu', 'false'); }

// animateIcon = (icon) => {
//     icon.classList.add('infinite');
//     setTimeout(() => {
//         icon.classList.remove('infinite');
//     }, 1000);
// }