/*
 
jetpack title: "YupGrade"
jetpack documentation: 
revision "1.0"
last-modified "2010-01-30"
license: Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
platform documentation: https://developer.mozilla.org/en/Jetpack


Description:
* 
* The YupGrade Jetpack helps you challenge yourself 
* and your friends to keep up with current events.
* 
* When you visit a newsworthy article, video, or blog post, 
* a panel preview links to related topics and experts.
* 
* The panel also includes shortcuts that help you 
* complete YupGrade challenges and earn rewards for your inventory.
* 
 
 
TODO:
  - Improved Facebook and Twitter integration
  - Improve Server-Side Topic/Expert Matching
  - public API endpoints for open-source extensibility
  - Tag current page as "Controversy", "Cause", or other news category
  - Topic Drag-N-Drop feature
*/

/* vars */
$yupgradeDomain = "http://www.yupgrade.com";
$yupgradeIcon = $yupgradeDomain + "/favicon.ico";

var manifest = {
  firstRunPage: $yupgradeDomain + "/jetpack?installed=true",
  settings:[
         { name: "status_prefix", type: "text", label: "Status Message Prefix",  default: "I enjoyed this link:" }
        ]
};

/* imports */
jetpack.future.import("slideBar");
jetpack.future.import("menu");
jetpack.future.import("storage.settings");
jetpack.future.import("storage.simple"); 



/*
 * 
 * YupGrade Panel: Appears at Bottom of News-Themed Pages
 * Shows Related Topics and Experts. 
 * Shortcuts to Share on Twitter or Facebook and take a quiz
 * 
 */

function initializePanel(html){

var $panel = jQuery(jetpack.tabs.focused.contentDocument.createElement('div'));
$panel.append(html);
$panel.find('button').click(function(){
switch($(this).attr('id')){
case "twitter":
return postCurrentPageOnTwitter();
case "facebook":
return postCurrentPageOnFacebook();
break;
case "yupgrade":
return takeYupGradeQuiz();
break;
}
});
jQuery(jetpack.tabs.focused.contentDocument.body).append($panel.children());                              

}

 jetpack.tabs.onReady(function() { 
 
if (jQuery(jetpack.tabs.focused.contentDocument).data('yupgrade_panel')) return;
jQuery(jetpack.tabs.focused.contentDocument).data('yupgrade_panel', true);

 // retrieve panel HTML from
 // TODO: Do a basic filter first on client to cut down on # of requests
 jQuery.ajax({
        type: "GET", 
        url: $yupgradeDomain + '/jetpack/rpc',
        datatype: "HTML",
        data: { 
             'action': 'initializeJetpackPanel',
             'url': jetpack.tabs.focused.contentDocument.location.href,
             'title': jetpack.tabs.focused.contentDocument.title
             },
        error: function() { console.log('error'); return false; },
        success: function(response) {
      if (response == "None") console.log('response was "None"');    
      else initializePanel(response); 
           }
        }); 

       
}); 


/*
 * Panel Button Methods
 */

function postCurrentPageOnTwitter(){

  var $linkUrl = jetpack.tabs.focused.contentDocument.location.href;
  var $statusMsg = jetpack.storage.settings.status_prefix + " -- " + $linkUrl;
  var $statusPlatform = "Twitter";
  jetpack.lib.twitter.statuses.update({
    data: {
      status: $statusMsg
    },
    /* enter login info at the prompt */
    //username: "basic_auth_username",
    // password: "basic_auth_password",
    success: function () {
       jetpack.notifications.show({
          title: "YupGrade", 
          body: "Posted on " + $statusPlatform + ": " + $statusMsg, 
          icon: $yupgradeIcon
        });
    }
  });
  
};

function postCurrentPageOnFacebook(){
$facebook_url = "http://www.facebook.com/sharer.php" 
+ "?u=" + jetpack.tabs.focused.contentDocument.location.href
+ "&t=" + jetpack.tabs.focused.contentDocument.title
+ " -- Shared With My YupGrade Jetpack.";
jetpack.tabs.open($facebook_url);
};

function takeYupGradeQuiz(){
console.log('todo: take quiz on YupGrade');
};


/* Add Menu Set for Right-Click Menu */

$yupgradeMenu = new jetpack.Menu(
    ["Share This Page on Twitter",
     "Share This Page on Facebook",
     "Visit My YupGrade Profile"]
    );
    
jetpack.menu.context.page.add({  
  label: "YupGrade",  
  icon: $yupgradeIcon,  
  menu: $yupgradeMenu,
  command: function(menuitem) {
    switch (menuitem.label){
      case "Share This Page on Twitter":
        return postCurrentPageOnTwitter();
      case  "Share This Page on Facebook":
        return postCurrentPageOnFacebook();
      case  "Visit My YupGrade Profile":
        return jetpack.tabs.open("http://www.yupgrade.com/login");
      }
  }
});


// Status Bar Icon Toggles Panel Visibility
function togglePanelVisibility(){
  $yupgrade_jetpack_panel = jQuery(jetpack.tabs.focused.contentDocument)
  .find('#yupgrade_jetpack_panel');
  $yupgrade_jetpack_panel.toggle();

}
 jetpack.statusBar.append({
  html: "<img style='cursor:pointer;' src='" + $yupgradeIcon + "'/>",
  onReady: function(widget){
          $(widget).click(function(){
            togglePanelVisibility();
          });
    }
});


/* Search for Topics on YupGrade After Selecting Text */
jetpack.future.import('selection');
jetpack.menu.context.page.beforeShow = function (menu) {  
  menu.reset();  
  if (jetpack.selection.text)  
    menu.add({  
      label: "Search For " + jetpack.selection.text + " on YupGrade",  
      icon: $yupgradeIcon, 
      command: function () {  
        window.location.href = $yupgradeDomain + "/topic/" + jetpack.selection.text;
      }  
    });  
};  
