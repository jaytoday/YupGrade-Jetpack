/*
 
Description:
    Share links on Twitter and Facebook (accessible via YupGrade)
    and visit YupGrade profile.
 
TODO:
  - Contextual information about webpage (tagged topics and people)
  - Crowdsourcing ability (tag links as "Controversial", etc.)

jetpack title: "YupGrade"
jetpack documentation: 
revision "0.3"
last-modified "2010-01-05"
license: Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
platform documentation: https://developer.mozilla.org/en/Jetpack

*/

$yupgradeIcon = "http://www.yupgrade.com/favicon.ico";

var manifest = {
  firstRunPage: "http://www.yupgrade.com/jetpack?installed=true",
  settings:[
         { name: "status_prefix", 
           type: "text", 
           label: "Status Message Prefix",  
           default: "Just passing along a link..."
         }
        ]
};

jetpack.future.import("slideBar");
jetpack.future.import("menu");
jetpack.future.import("storage.settings");
jetpack.future.import("storage.simple");  


function postCurrentPage(){

  var $linkUrl = jetpack.tabs.focused.contentDocument.location;
  var $statusMsg = jetpack.storage.settings.status_prefix + " " + $linkUrl;
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
    ["Post This Page on Twitter",
     "View My YupGrade Profile"]
    );
    
jetpack.menu.context.page.add({  
  label: "YupGrade",  
  icon: "http://www.yupgrade.com/favicon.ico",  
  menu: $yupgradeMenu,
  command: function(menuitem) {
      if (menuitem.label ===  "Post This Page on Twitter")
        return postCurrentPage();
      if (menuitem.label ===  "View My YupGrade Profile")
        return jetpack.tabs.open("http://www.yupgrade.com/login");
      
  }
});

 jetpack.statusBar.append({
  html: "<img style='cursor:pointer;' src='" + $yupgradeIcon + "'/>",
  onReady: function(widget){
          $(widget).click(function(){
            postCurrentPage();
           // TODO: Pop-up panel with options
          });
    }
});

/*        
jetpack.future.import('selection');
jetpack.selection.onSelection(function(){
  var textOfSel = jetpack.selection.text;
  console.log(textOfSel);
});
*/
