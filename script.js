console.log("runninf");
let currentsongs = new Audio();
let songs;
let curFolder;

function formatTime(seconds) {
  // Calculate minutes and seconds
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;

  // Add leading zeros if needed
  var minutesStr = (minutes < 10) ? "0" + minutes : minutes;
  var secondsStr = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

  // Combine minutes and seconds with a colon
  var formattedTime = Math.round(minutesStr) + ":" + Math.round(secondsStr);

  return formattedTime;
}


async function getSongs(folder) {
  curFolder=folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
   songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}`)[1])
    }
  }
  
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songul.innerHTML="";
  for (const song of songs) {
    songul.innerHTML = songul.innerHTML + `<li>
     <img class="invert" src="image/imag.svg" alt="" srcset="">
     <div class="info">
         <div>${song.replaceAll("%20", " ")}</div>
         <div>Adarsh</div>
     </div>
     <div class="playnow">
         <span class="topclass">PlayNow</span>
        <img class="invert" src="image/new.svg" alt="">
     </div>
     </li>`
  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

    e.addEventListener("click", element => {
      
      playmusic(e.getElementsByTagName("div")[0].firstElementChild.innerHTML)
    })


  })

  return songs
}
const playmusic = (track, pause = false) => {
  currentsongs.src = `${curFolder}` + track
  if (!pause) {
    currentsongs.play()
    play.src = "image/pause.svg"
  }


  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00/00"
}

async function displayalbum(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors=div.getElementsByTagName("a")
  let cardcontainer =document.querySelector(".cardcontainer")

 let array= Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if(e.href.includes("/songs/")){
      let folder=(e.href.split("/").slice(-2)[1])
      //get the metadata
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response)
      cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card ">
      <div class="circle">
          <svg class="change" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24"
              height="24" fill="none">
              <path
                  d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                  stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
          </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg" alt="">
      <h2>${response.title}</h2>
      <p>${response.description}</p>
  </div>`
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach(e=>{
   
    e.addEventListener("click",async item=>{
      console.log(item.target,item.currentTarget.dataset.folder)
      songs=await getSongs(`songs/${item.currentTarget.dataset.folder}`)
      playmusic(songs[0])
    })
  })

}

async function main() {

  //list of songs
   await getSongs("songs/cs");
  playmusic(songs[0], true)
  //console.log(songs)
   
//display albums on the page
  displayalbum()

  play.addEventListener("click", () => {
    if (currentsongs.paused) {
      currentsongs.play();
      play.src = "image/pause.svg"

    }
    else {
      currentsongs.pause();
      play.src = "image/play.svg"

    }
  })
  currentsongs.addEventListener("timeupdate", () => {
   
    document.querySelector('.songtime').innerHTML = `${formatTime(currentsongs.currentTime)} / ${formatTime(currentsongs.duration)}`
    document.querySelector(".round").style.left = (currentsongs.currentTime / currentsongs.duration) * 100 + "%"
  })
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".round").style.left = percent + "%";
    currentsongs.currentTime = ((currentsongs.duration) * percent) / 100
  })
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.transform = "translateX(0)"
  })
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.transform = "translateX(-200%)"
  })
  previous.addEventListener("click", () => {
    
    let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
      playmusic(songs[index - 1])
    }
  })
  next.addEventListener("click", () => {
  

    let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playmusic(songs[index + 1])
    }
  })
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",e=>{
    
    currentsongs.volume=(e.target.value)/100
  })

 document.querySelector(".volume>img").addEventListener("click",e=>{
  console.log(e.target)
  if(e.target.src.includes("image/volume.svg")){
    e.target.src= e.target.src.replace("image/volume.svg","image/mute.svg")
    currentsongs.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
  }
  else{
    e.target.src=e.target.src.replace("image/mute.svg","image/volume.svg",)

    currentsongs.volume=.50;
    document.querySelector(".range").getElementsByTagName("input")[0].value=50
  }
 })
 
 
}
main()