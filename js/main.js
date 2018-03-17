
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

  const remainingTime = () => {
    let m = parseInt(minutes.textContent);
    let s = parseInt(seconds.textContent);
    return m * 60 + s;
  }

  const countdown = (time) => {
    function tick() {
      time--;
      if( time > 0 && !isPaused) {
        let m = parseInt(time/60);
        let s = (time % 60);
        s = s >= 10 ? s : '0' + s.toString();
        minutes.textContent = m;
        seconds.textContent = s;
        setTimeout(tick, 1000);
      }else if(time === 0){
        alarm.play()
        if(!isOnBreak){
          minutes.textContent = breakSession.textContent;
          seconds.textContent = '00';
          mainBtn.textContent = "Start Break Session";
          mainBtn.setAttribute('data-state', 'work-done');
        }else{
          minutes.textContent = '0';
          seconds.textContent = '00';
          mainBtn.textContent = "Reset For New Session";
          mainBtn.setAttribute('data-state', 'break-done');
        }
      }
    }
    setTimeout(tick, 1000);
  }

  const alarm = new Audio("assets/alarm.wav");
  alarm.loop = true;

  let isPaused = false;
  let isOnBreak = false;

  reset.onclick = () => {
    isPaused = true;
    isOnBreak = false;
    alarm.pause();
    minutes.textContent = '25';
    seconds.textContent = '00';
    workSession.textContent = '25';
    breakSession.textContent = '5';
    mainBtn.setAttribute('data-state', 'none');
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
      let command, state, currentTime;
      command = btn.getAttribute('data-command');
      state = mainBtn.getAttribute('data-state');

      if(command && (isPaused || state === 'none')){
        switch (command) {
          case 'add_work_minutes':
            currentTime = parseInt(workSession.textContent);
            workSession.textContent  = currentTime+5;
            minutes.textContent  = currentTime+5;
            seconds.textContent  = '00';
            mainBtn.setAttribute('data-state', 'none');
            mainBtn.textContent = 'START';
            break;

          case 'reduce_work_minutes':
            currentTime = parseInt(workSession.textContent);
            if(currentTime > 10){
              workSession.textContent  = currentTime-5;
              minutes.textContent  = currentTime-5;
            }
            mainBtn.setAttribute('data-state', 'none');
            mainBtn.textContent = 'START';
            break;

          case 'add_break_minutes':
            currentTime = parseInt(breakSession.textContent);
            breakSession.textContent  = currentTime+5;
            minutes.textContent = workSession.textContent;
            seconds.textContent  = '00';
            mainBtn.setAttribute('data-state', 'none');
            mainBtn.textContent = 'START';
            break;

          case 'reduce_break_minutes':
            currentTime = parseInt(breakSession.textContent);
            if(currentTime > 5){
              breakSession.textContent  = currentTime-5;
            }
            minutes.textContent = workSession.textContent;
            seconds.textContent  = '00';
            mainBtn.setAttribute('data-state', 'none');
            mainBtn.textContent = 'START';
            break;


          default:

        }
      }
    }
  });

  mainBtn.onclick = () => {
    let state = mainBtn.getAttribute('data-state');
    // console.log(state);
    switch (state) {
      case 'none':
        isPaused = false;
        mainBtn.textContent = 'Work Session Ongoing';
        mainBtn.setAttribute('data-state', 'work-ongoing');
        countdown(remainingTime());
        break;

      case 'work-ongoing':
        isPaused = true;
        mainBtn.textContent = 'Work Session Paused';
        mainBtn.setAttribute('data-state', 'work-paused');
        break;

      case 'work-paused':
        isPaused = false;
        mainBtn.textContent = 'Work Session Ongoing';
        mainBtn.setAttribute('data-state', 'work-ongoing');
        countdown(remainingTime());
        break;

      case 'work-done':
        alarm.pause();
        isPaused = false;
        isOnBreak = true;
        mainBtn.textContent = 'Break Session Ongoing';
        mainBtn.setAttribute('data-state', 'break-ongoing');
        countdown(remainingTime());
        break;

      case 'break-ongoing':
        isPaused = true;
        mainBtn.textContent = 'Break Session Paused';
        mainBtn.setAttribute('data-state', 'break-paused');
        break;

      case 'break-paused':
        isPaused = false;
        mainBtn.textContent = 'Break Session Ongoing';
        mainBtn.setAttribute('data-state', 'break-ongoing');
        countdown(remainingTime());
        break;

      case 'break-done':
        reset.click();
        break;
      default:

    }
  }


  window.onload = () => {
    about.click();
  }

})();
