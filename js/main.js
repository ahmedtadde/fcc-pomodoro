
(function(){
  const reset = document.getElementById('btn-reset');
  const about = document.getElementById('btn-about');
  const modal = document.getElementById('section-modal');
  const modalBtn = document.getElementById('btn-modal');

  const minutes = document.getElementById('minutes');
  const seconds = document.getElementById('seconds');
  const workSession = document.getElementById('work');
  const breakSession = document.getElementById('break');
  const mainBtn = document.getElementById('btn-activator');


  const settingBtns = Array.from(document.getElementsByClassName('btn-adjust'));

  const countdown = (time) => {
    function tick() {
      time--;
      if( time > 0 && !pause) {
        let m = parseInt(time/60);
        let s = (time % 60);

        // m = m > 10 ? m : '0' + m.toString();
        s = s >= 10 ? s : '0' + s.toString();

        minutes.textContent = m;
        seconds.textContent = s;
        setTimeout(tick, 1000);
      }else if(time === 0){
        if(!onbreak){
          onbreak = true;
          minutes.textContent = breakSession.textContent;
          seconds.textContent = '00';
          mainBtn.textContent = "Start Break Session";
        }else{
          minutes.textContent = '00';
          seconds.textContent = '00';
          mainBtn.textContent = "Reset";
        }
      }
    }
    setTimeout(tick, 1000);
  }

  let pause = true;
  let onbreak = false;

  reset.onclick = () => {
    pause = true;
    onbreak = false;
    minutes.textContent = '5';
    seconds.textContent = '00';
    workSession.textContent = '5';
    breakSession.textContent = '5';
    mainBtn.setAttribute('data-state', 'paused');
    mainBtn.setAttribute('data-reset', 'false');
    mainBtn.textContent = 'START';
  }


  about.onclick = () => {
    modal.style.display = 'flex';
  }

  modalBtn.onclick = () => {
    modal.style.display = 'none';
  }

  window.onclick = (e) => {
    if(e.target === modal){
      modal.style.display = 'none';
    }
  }

  settingBtns.forEach((btn) => {
    btn.onclick = () => {
      let command, time;
      command = btn.getAttribute('data-command');

      if(command && pause){
        switch (command) {
          case 'add_work_minutes':
            currentTime = parseInt(workSession.textContent);
            workSession.textContent  = currentTime+1;
            minutes.textContent  = currentTime+1;
            seconds.textContent  = '00';
            break;

          case 'reduce_work_minutes':
            currentTime = parseInt(workSession.textContent);
            if(currentTime > 2){
              workSession.textContent  = currentTime-1;
              minutes.textContent  = currentTime-1;
            }

            break;

          case 'add_break_minutes':
            currentTime = parseInt(breakSession.textContent);
            breakSession.textContent  = currentTime+1;
            break;

          case 'reduce_break_minutes':
            currentTime = parseInt(breakSession.textContent);
            if(currentTime > 1){
              breakSession.textContent  = currentTime-1;
            }
            break;


          default:

        }
      }
    }
  });

  mainBtn.onclick = () => {
    if(mainBtn.getAttribute('data-reset') === 'true'){
      reset.click();
      mainBtn.setAttribute('data-reset', 'false');
    }else{
      let state = mainBtn.getAttribute('data-state');
      if(state === 'inactive'){
        if(!onbreak){
          mainBtn.textContent = 'Work Session Ongoing';
        }else{
          mainBtn.textContent = 'Break Session Ongoing';
        }
        pause = false;
        let m = parseInt(minutes.textContent);
        let s = parseInt(seconds.textContent);
        let time = m * 60 + s;
        mainBtn.setAttribute('data-state', 'ongoing');
        countdown(time);
      }else if(state === 'ongoing'){
        if(!onbreak){
          mainBtn.textContent = 'Work Session Paused';
        }else{
          mainBtn.textContent = 'Break Session Paused';
        }
        pause = true;
        mainBtn.setAttribute('data-state', 'inactive');
      }
    }
  }


  // window.onload = () => {
  //   aboutBtn.click();
  // }

})();
