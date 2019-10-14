/* eslint-disable */
/*!
 * VERSION: 0.9.2
 * DATE: 2014-02-10
 * JavaScript
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * ThrowPropsPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://www.greensock.com/club/ to sign up or get more details.
 * This work is subject to the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("plugins.ThrowPropsPlugin",["plugins.TweenPlugin","TweenLite","easing.Ease","utils.VelocityTracker"],function(t,e,i,s){let r,n,a,o,l=function(){t.call(this,"throwProps"),this._overwriteProps.length=0},h=999999999999999,u=1e-10,p={x:1,y:1,z:2,scale:1,scaleX:1,scaleY:1,rotation:1,rotationZ:1,rotationX:2,rotationY:2,skewX:1,skewY:1},_=function(t,e,i,s){for(var r,n,a=e.length,o=0,l=h;--a>-1;){r=e[a],n=r-t,0>n&&(n=-n),l>n&&r>=s&&i>=r&&(o=a,l=n);}return e[o]},c=function(t,e,i,s){if("auto"===t.end){return t;}i=isNaN(i)?h:i,s=isNaN(s)?-h:s;let r="function"==typeof t.end?t.end(e):t.end instanceof Array?_(e,t.end,i,s):Number(t.end);return r>i?r=i:s>r&&(r=s),{max:r,min:r}},f=l.calculateChange=function(t,s,r,n){null==n&&(n=.05);let a=s instanceof i?s:s?new i(s):e.defaultEase;return r*n*t/a.getRatio(n)},d=l.calculateDuration=function(t,s,r,n,a){a=a||.05;let o=n instanceof i?n:n?new i(n):e.defaultEase;return Math.abs((s-t)*o.getRatio(a)/r/a)},m=l.calculateTweenDuration=function(t,r,n,a,o){if("string"==typeof t&&(t=e.selector(t)),!t){return 0;}null==n&&(n=10),null==a&&(a=.2),null==o&&(o=1),t.length&&(t=t[0]||t);let h,p,_,m,g,v,y,w,x,T,b=0,P=9999999999,k=r.throwProps||r,S=r.ease instanceof i?r.ease:r.ease?new i(r.ease):e.defaultEase,C=isNaN(k.checkpoint)?.05:Number(k.checkpoint),R=isNaN(k.resistance)?l.defaultResistance:Number(k.resistance);for(h in k){"resistance"!==h&&"checkpoint"!==h&&"preventOvershoot"!==h&&(p=k[h],"object"!=typeof p&&(x=x||s.getByTarget(t),x&&x.isTrackingProp(h)?p="number"==typeof p?{velocity:p}:{velocity:x.getVelocity(h)}:(m=Number(p)||0,_=m*R>0?m/R:m/-R)),"object"==typeof p&&(void 0!==p.velocity&&"number"==typeof p.velocity?m=Number(p.velocity)||0:(x=x||s.getByTarget(t),m=x&&x.isTrackingProp(h)?x.getVelocity(h):0),g=isNaN(p.resistance)?R:Number(p.resistance),_=m*g>0?m/g:m/-g,v="function"==typeof t[h]?t[h.indexOf("set")||"function"!=typeof t["get"+h.substr(3)]?h:"get"+h.substr(3)]():t[h]||0,y=v+f(m,S,_,C),void 0!==p.end&&(p=c(p,y,p.max,p.min)),void 0!==p.max&&y>Number(p.max)+u?(T=p.unitFactor||1,w=v>p.max&&p.min!==p.max||m*T>-15&&45>m*T?a+.1*(n-a):d(v,p.max,m,S,C),P>w+o&&(P=w+o)):void 0!==p.min&&Number(p.min)-u>y&&(T=p.unitFactor||1,w=p.min>v&&p.min!==p.max||m*T>-45&&15>m*T?a+.1*(n-a):d(v,p.min,m,S,C),P>w+o&&(P=w+o)),w>b&&(b=w)),_>b&&(b=_));}return b>P&&(b=P),b>n?n:a>b?a:b},g=l.prototype=new t("throwProps");return g.constructor=l,l.version="0.9.2",l.API=2,l._autoCSS=!0,l.defaultResistance=100,l.track=function(t,e,i){return s.track(t,e,i)},l.untrack=function(t,e){s.untrack(t,e)},l.isTracking=function(t,e){return s.isTracking(t,e)},l.getVelocity=function(t,e){let i=s.getByTarget(t);return i?i.getVelocity(e):0/0},l._cssRegister=function(){let t=(window.GreenSockGlobals||window).com.greensock.plugins.CSSPlugin;if(t){let e=t._internals,i=e._parseToProxy,a=e._setPluginRatio,o=e.CSSPropTween;e._registerComplexSpecialProp("throwProps",{parser(t,e,h,u,_,c){c=new l;var f,d,m,g,v,y={},w={},x={},T={},b={},P={};n={};for(m in e)"resistance"!==m&&"preventOvershoot"!==m&&(d=e[m],"object"==typeof d?(void 0!==d.velocity&&"number"==typeof d.velocity?y[m]=Number(d.velocity)||0:(v=v||s.getByTarget(t),y[m]=v&&v.isTrackingProp(m)?v.getVelocity(m):0),void 0!==d.end&&(T[m]=d.end),void 0!==d.min&&(w[m]=d.min),void 0!==d.max&&(x[m]=d.max),d.preventOvershoot&&(P[m]=!0),void 0!==d.resistance&&(f=!0,b[m]=d.resistance)):"number"==typeof d?y[m]=d:(v=v||s.getByTarget(t),y[m]=v&&v.isTrackingProp(m)?v.getVelocity(m):d||0),p[m]&&u._enableTransforms(2===p[m]));g=i(t,y,u,_,c),r=g.proxy,y=g.end;for(m in r)n[m]={velocity:y[m],min:w[m],max:x[m],end:T[m],resistance:b[m],preventOvershoot:P[m]};return null!=e.resistance&&(n.resistance=e.resistance),e.preventOvershoot&&(n.preventOvershoot=!0),_=new o(t,"throwProps",0,0,g.pt,2),_.plugin=c,_.setRatio=a,_.data=g,c._onInitTween(r,n,u._tween),_}})}},l.to=function(t,i,s,l,h){i.throwProps||(i={throwProps:i}),0===h&&(i.throwProps.preventOvershoot=!0);let u=new e(t,1,i);return u.render(0,!0,!0),u.vars.css?(u.duration(m(r,{throwProps:n,ease:i.ease},s,l,h)),u._delay&&!u.vars.immediateRender?u.invalidate():a._onInitTween(r,o,u),u):(u.kill(),new e(t,m(t,i,s,l,h),i))},g._onInitTween=function(t,e,i){this.target=t,this._props=[],a=this,o=e;let r,n,l,h,u,p,_,d,m,g=i._ease,v=isNaN(e.checkpoint)?.05:Number(e.checkpoint),y=i._duration,w=e.preventOvershoot,x=0;for(r in e){if("resistance"!==r&&"checkpoint"!==r&&"preventOvershoot"!==r){if(n=e[r],"number"==typeof n)u=Number(n)||0;else if("object"!=typeof n||isNaN(n.velocity)){if(m=m||s.getByTarget(t),!m||!m.isTrackingProp(r))throw"ERROR: No velocity was defined in the throwProps tween of "+t+" property: "+r;u=m.getVelocity(r)}else u=Number(n.velocity);p=f(u,g,y,v),d=0,h="function"==typeof t[r],l=h?t[r.indexOf("set")||"function"!=typeof t["get"+r.substr(3)]?r:"get"+r.substr(3)]():t[r],"object"==typeof n&&(_=l+p,void 0!==n.end&&(n=c(n,_,n.max,n.min)),void 0!==n.max&&_>Number(n.max)?w||n.preventOvershoot?p=n.max-l:d=n.max-l-p:void 0!==n.min&&Number(n.min)>_&&(w||n.preventOvershoot?p=n.min-l:d=n.min-l-p)),this._props[x++]={p:r,s:l,c1:p,c2:d,f:h,r:!1},this._overwriteProps[x]=r}}return!0},g._kill=function(e){for(let i=this._props.length;--i>-1;){null!=e[this._props[i].p]&&this._props.splice(i,1);}return t.prototype._kill.call(this,e)},g._roundProps=function(t,e){for(let i=this._props,s=i.length;--s>-1;){(t[i[s]]||t.throwProps)&&(i[s].r=e)}},g.setRatio=function(t){for(var e,i,s=this._props.length;--s>-1;){e=this._props[s],i=e.s+e.c1*t+e.c2*t*t,e.r&&(i=0|i+(i>0?.5:-.5)),e.f?this.target[e.p](i):this.target[e.p]=i}},t.activate([l]),l},!0),window._gsDefine("utils.VelocityTracker",["TweenLite"],function(t){let e,i,s,r,n=/([A-Z])/g,a={},o={x:1,y:1,z:2,scale:1,scaleX:1,scaleY:1,rotation:1,rotationZ:1,rotationX:2,rotationY:2,skewX:1,skewY:1},l=document.defaultView?document.defaultView.getComputedStyle:function(){},h=function(t,e,i){let s=(t._gsTransform||a)[e];return s||0===s?s:(t.style[e]?s=t.style[e]:(i=i||l(t,null))?(t=i.getPropertyValue(e.replace(n,"-$1").toLowerCase()),s=t||i.length?t:i[e]):t.currentStyle&&(i=t.currentStyle,s=i[e]),parseFloat(s)||0)},u=t.ticker,p=function(t,e,i){this.p=t,this.f=e,this.v1=this.v2=0,this.t1=this.t2=u.time,this.css=!1,this.type="",this._prev=null,i&&(this._next=i,i._prev=this)},_=function(){let t,i,n=e,a=u.time;if(a-s>=.03){for(r=s,s=a;n;){for(i=n._firstVP;i;)t=i.css?h(n.target,i.p):i.f?n.target[i.p]():n.target[i.p],(t!==i.v1||a-i.t1>.15)&&(i.v2=i.v1,i.v1=t,i.t2=i.t1,i.t1=a),i=i._next;n=n._next}}},c=function(t){this._lookup={},this.target=t,this.elem=t.style&&t.nodeType?!0:!1,i||(u.addEventListener("tick",_,null,!1,-100),s=r=u.time,i=!0),e&&(this._next=e,e._prev=this),e=this},f=c.getByTarget=function(t){for(let i=e;i;){if(i.target===t){return i;}i=i._next}},d=c.prototype;return d.addProp=function(e,i){if(!this._lookup[e]){let s=this.target,r="function"==typeof s[e],n=r?this._altProp(e):e,a=this._firstVP;this._firstVP=this._lookup[e]=this._lookup[n]=a=new p(n!==e&&0===e.indexOf("set")?n:e,r,a),a.css=this.elem&&(void 0!==this.target.style[a.p]||o[a.p]),a.css&&o[a.p]&&!s._gsTransform&&t.set(s,{x:"+=0"}),a.type=i||a.css&&0===e.indexOf("rotation")?"deg":"",a.v1=a.v2=a.css?h(s,a.p):r?s[a.p]():s[a.p]}},d.removeProp=function(t){let e=this._lookup[t];e&&(e._prev?e._prev._next=e._next:e===this._firstVP&&(this._firstVP=e._next),e._next&&(e._next._prev=e._prev),this._lookup[t]=0,e.f&&(this._lookup[this._altProp(t)]=0))},d.isTrackingProp=function(t){return this._lookup[t]instanceof p},d.getVelocity=function(t){let e,i,s,r=this._lookup[t],n=this.target;if(!r){throw"The velocity of "+t+" is not being tracked.";}return e=r.css?h(n,r.p):r.f?n[r.p]():n[r.p],i=e-r.v2,("rad"===r.type||"deg"===r.type)&&(s="rad"===r.type?2*Math.PI:360,i%=s,i!==i%(s/2)&&(i=0>i?i+s:i-s)),i/(u.time-r.t2)},d._altProp=function(t){let e=t.substr(0,3),i=("get"===e?"set":"set"===e?"get":e)+t.substr(3);return"function"==typeof this.target[i]?i:t},c.getByTarget=function(i){let s=e;for("string"==typeof i&&(i=t.selector(i)),i.length&&i!==window&&i[0]&&i[0].style&&!i.nodeType&&(i=i[0]);s;){if(s.target===i){return s;}s=s._next}},c.track=function(t,e,i){let s=f(t),r=e.split(","),n=r.length;for(i=(i||"").split(","),s||(s=new c(t));--n>-1;){s.addProp(r[n],i[n]||i[0]);}return s},c.untrack=function(t,i){let s=f(t),r=(i||"").split(","),n=r.length;if(s){for(;--n>-1;){s.removeProp(r[n]);}s._firstVP&&i||(s._prev?s._prev._next=s._next:s===e&&(e=s._next),s._next&&(s._next._prev=s._prev))}},c.isTracking=function(t,e){let i=f(t);return i?!e&&i._firstVP?!0:i.isTrackingProp(e):!1},c},!0)}),window._gsDefine&&window._gsQueue.pop()();
