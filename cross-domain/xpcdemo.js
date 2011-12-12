var xpcdemo = (function() {
   var xpc = {};
   
   xpc._channel = null;
   
   xpc.listen = function() {
       function receiveMessage(event)
       {
           xpc.log_msg(event.data + " | " + event.origin);
       }
       
       window.addEventListener("message", receiveMessage, false);
   };
   
   xpc.log_msg = function(s_msg) {
       var log = document.getElementById('log');
       if(!log) {
           log = document.createElement('div');
           log.id = 'log';
           document.body.appendChild(log);
       }
       var msg = document.createElement('p');
       msg.innerHTML = s_msg;
       log.insertBefore(msg, log.children[0]);
       
   }
   
   xpc.createiframe = function(url) {
       var iframe = document.createElement('iframe');
       iframe.id = 'xpc-iframe';
       iframe.style.cssText = 'width: 50%; height: 100%; float: right;'
       document.body.appendChild(iframe);
       iframe.src = url;
       
       xpc._channel = iframe.contentWindow;
   };
   
   xpc.reset_channel = function() {
       if(!!window.parent && !(window.top === window.self) ) {
           // iframe
           xpc._channel = window.parent;
       } else {
           var iframe = document.getElementById('xpc-iframe');
           xpc._channel = iframe.contentWindow;           
       }
   };
   
   xpc.setup_outer = function() {
      xpc.createiframe(document.location.href.replace('local.dev.html', 'local.cdn.html'));
      //xpc.createiframe(document.location.href.replace('local.dev', 'local.cdn', 'g'));  
      xpc.listen();
      xpc.log_msg(document.location.href);
   };
      
   xpc.setup_inner = function() {
       xpc._channel = window.parent;
       xpc.listen();
       xpc.log_msg(document.location.href);
   };
   
   xpc.send = function(msg) {
       xpc._channel.postMessage(msg, "*")
   };
   
   xpc.reset_domain = function() {
       // go from www.at.long.local.dev to local.dev
       var old_domain = document.domain;
       document.domain = document.domain.split(".").slice(-2).join('.');
       xpc.log_msg('Changed domain from : ' + old_domain + ' to ' + document.domain);
   };
   return xpc;
}());