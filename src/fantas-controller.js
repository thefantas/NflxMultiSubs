class FantasController {
  constructor() {
    this.keyUpHandler = undefined;
    this.timer = undefined;
    this.rewind = 3000;
    this.fastForward = 3000;
	// this.idNetflix = undefined;
  }


  activate() {
    if (this.keyUpHandler) return;
	//this._getSettings;

    this.keyUpHandler = window.addEventListener('keyup',
      this._keyUpHandler.bind(this));
  }

  deactivate() {
    if (!this.keyUpHandler) return;

    window.removeEventListener('keyup', this.keyUpHandler);
    this.keyUpHandler = null;
  }
  
/*   _getSettings() {
	chrome.storage.local.get(["rewind", "fastForward"], function(result){
		var result = profileObj.profile;
		if (typeof result.rewind === "undefined") {
			// chrome.storage.local.set({"rewind": 3, "fastForward": 3});
			chrome.storage.local.set({"rewind": 3});
		} else {
			this.rewind = result.rewind;
		}
		if (typeof result.fastForward === "undefined") {
			chrome.storage.local.set({"fastForward": 3});
		} else {
			this.fastForward = result.fastForward;
		}
		// Showing first the first one and then the second one
		console.log(result.rewind);
		console.log(result.fastForward);
	});
  } */

  _getIDNetflix() {
		var e;
		try {
			e = netflix.appContext.state.playerApp.getAPI().videoPlayer
		} catch (t) {
			try {
				e = netflix.appContext.getPlayerApp().getAPI().videoPlayer
			} catch (e) {
				console.errorWithoutReport(e)
			}
		}
		var t = e.getAllPlayerSessionIds(),
			n = (t = Array.from(t))[t.length - 1];
		if (2 <= t.length) {
			var r = t.find(function(e) {
				return /watch/i.test(e)
			});
			r && (n = r)
		} else 0 === t.length && console.warn("Couldn't find out the playerSessionId");
		return e.getVideoPlayerBySessionId(n)
	}

  _keyUpHandler(evt) {
    if (evt.ctrlKey || evt.altKey || evt.shiftKey || evt.metaKey) return;
    if ((evt.keyCode !== 66 ) && (evt.keyCode !== 81 ) && (evt.keyCode !== 78 /* ] */)) return;

    const playerContainer = document.querySelector('.nf-player-container');
    if (!playerContainer) return;

	if (evt.keyCode === 66 || evt.keyCode === 81) {//rewind
		var t = this._getIDNetflix(),
			n = t.getCurrentTime();
		t.seek(n < this.rewind ? 0 : n - this.rewind);
		t.getPaused() && t.play();
	
		/* 	var data = {
		  allowedTypes: 'those supported by structured cloning, see the list below',
		  inShort: 'no DOM elements or classes/functions',
		};

		document.dispatchEvent(new CustomEvent('NflxReceiver', { detail: data })); */
			
		
		/* chrome.storage.local.get(['rewind'], function(result2) {
          console.log('Value currently is ' + result2.rewind);
        }); */
		// console.log(this.fastForward);			#FFE2A9 stroke 2 
	}
	
	if (evt.keyCode === 78) {//fast
		var t = this._getIDNetflix(),
			n = t.getCurrentTime();
		t.seek(n + this.fastForward);
		t.getPaused() && t.play();
	}
	

    let osd = document.querySelector('.nflxmultisubs-playback-rate');
    if (!osd) {
      osd = document.createElement('div');
      osd.classList.add('nflxmultisubs-playback-rate');
      osd.style.position = 'absolute'; osd.style.top = '10%'; osd.style.right = '5%';
      osd.style.fontSize = '36px'; osd.style.fontFamily = 'sans-serif';
      osd.style.fontWeight = '800'; osd.style.color = 'white';
      osd.style.display = 'flex'; osd.style.alignItems='center';
      osd.style.zIndex = 2;
      playerContainer.appendChild(osd);
    }
    if (!osd) return;

    osd.innerHTML = `<span>3s</span>`;

    if (this.timer) clearTimeout(this.timer);
    osd.style.transition = 'none';
    osd.style.opacity = '1';
    this.timer = setTimeout(() => {
      osd.style.transition = 'opacity 2.3s';
      osd.style.opacity = '0';
      this.timer = null;
    }, 200);
  }
}

module.exports = FantasController;
