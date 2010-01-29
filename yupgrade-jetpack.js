/*
 
Description:
    Share links on Twitter and Facebook (accessible via YupGrade)
    and visit YupGrade profile.
 
TODO:
  - Contextual information about webpage (tagged topics and people)
  - Crowdsourcing ability (tag links as "Controversial", etc.)

jetpack title: "YupGrade"
jetpack documentation: 
revision "0.8"
last-modified "2010-01-29"
license: Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
platform documentation: https://developer.mozilla.org/en/Jetpack

*/

/* vars */
//$yupgradeDomain = "http://localhost:8080";
$yupgradeDomain = "http://www.yupgrade.com";
$yupgradeIcon = $yupgradeDomain + "/favicon.ico";

var manifest = {
  firstRunPage: $yupgradeDomain + "/jetpack?installed=true",
  settings:[
         { name: "status_prefix", type: "text", label: "Status Message Prefix",  default: "I enjoyed this link:" }
        ]
};

jetpack.future.import("slideBar");
jetpack.future.import("menu");
jetpack.future.import("storage.settings");
jetpack.future.import("storage.simple");  // use this to store Twitter username (used to create YupGrade profile)



 jetpack.tabs.onReady(function() { 
 
if (jQuery(jetpack.tabs.focused.contentDocument).data('yupgrade_panel')) return;
jQuery(jetpack.tabs.focused.contentDocument).data('yupgrade_panel', true);

     
 jQuery.ajax({
        type: "GET", 
        url: $yupgradeDomain + '/jetpack/rpc',
        datatype: "HTML",
        data: { 
             'action': 'initializeJetpackPanel',
             'url': jetpack.tabs.focused.contentDocument.location.href
             },
        error: function() { console.log('error'); return false; },
        success: function(response) {
      if (response == "None") console.log('response was "None"');    
      else initializePanel(response); 
           }
        }); 

       
}); 



function runInit(){

}

function initializePanel(html){

var $panel = jQuery(jetpack.tabs.focused.contentDocument.createElement('div'));
$panel.append(html);
jQuery(jetpack.tabs.focused.contentDocument.body).append($panel.children());                              

}


function postCurrentPageOnTwitter(){

  var $linkUrl = jetpack.tabs.focused.contentDocument.location;
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
      if (menuitem.label ===  "Share This Page on Twitter")
        return postCurrentPageOnTwitter();
      if (menuitem.label ===  "Visit My YupGrade Profile")
        return jetpack.tabs.open("http://www.yupgrade.com/login");
      
  }
});

 jetpack.statusBar.append({
  html: "<img style='cursor:pointer;' src='" + $yupgradeIcon + "'/>",
  onReady: function(widget){
          $(widget).click(function(){
            postCurrentPageOnTwitter();
          });
    }
});


/* Initialize */

runInit();


/* Search for Topics on YupGrade */
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
