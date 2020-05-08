var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

function start(){
  var page = urlParams["page"] || 1
  $.ajax({
    url: '/api/posts?page='+page,
    contentType: "application/json",
    dataType: 'json',
    success: function(result){
      console.log("API result: " + JSON.stringify(result))
      if(JSON.stringify(result) != '{"success":false}') {
        //sort array by time of creation, new on the top
        var sorted = result.sort((a,b)=> parseFloat(b.time) - parseFloat(a.time))
        for(i=0;i<result.length;i++){
          var {success, background_image, profile_image, time, link, author, id, title, description, votes, comments} = sorted[i]
          let date_raw = new Date(Number(time)) + ''
          let date = (date_raw.split('(')[0]).slice(3)
          var html = `<div class="plx-card silver">
            <div class="pxc-bg" style="background-image:url('${background_image}')"></div>
            <div class="pxc-avatar"><img src="${profile_image}" /></div>
            <div class="pxc-subcard">
                <div class="pxc-title"><i class="fas fa-hand-holding-usd fa-border" onclick='tip("${link}", "${author}")'></i> <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> ${title}</div>
                <div class="pxc-sub">${description}</div>
              <div class="bottom-row">
                <a href='${link}' class='button1'>${link}</a>  &nbsp - ${votes} Votes - ${comments} Comments - ${date}
              </div>
            </div>
          </div>`
          document.getElementById('display').innerHTML += html
        }
        document.getElementById("loaders").remove();
      }
      else {
        alert('API Call failed, try again!')
      }
    }
  });
}

function trending(){
  var page = urlParams["page"] || 1
  $.ajax({
    url: '/api/posts?page='+page,
    contentType: "application/json",
    dataType: 'json',
    success: async function(result){
      //console.log("API result: " + JSON.stringify(result))
      if(JSON.stringify(result) != '{"success":false}') {
        //create trening array
        var trending = []
        //trending score algorithm
        for(i=0;i<result.length;i++){
          var trending_score = await trendingScoreCalculator(result[i])
          score = {
            id: result[i].id,
            trending_score: trending_score,
            background_image: result[i].image_preview,
            profile_image: result[i].profile_image,
						time: result[i].time,
            link: result[i].link,
            author: result[i].author,
            title: result[i].title,
            description: result[i].description,
            votes: result[i].votes,
            comments: result[i].comments
          }
          trending.push(score)
        }
        //sort array by time of creation, new on the top
        var sorted = trending.sort((a,b)=> parseFloat(b.trending_score) - parseFloat(a.trending_score))
        document.getElementById('display').innerHTML = ''
        for(i=0;i<result.length;i++){
          var {trending_score, background_image, profile_image, time, link, author, id, title, description, votes, comments} = sorted[i]
          let date_raw = new Date(Number(time)) + ''
          let date = (date_raw.split('(')[0]).slice(3)
          var html = `<div class="plx-card silver">
            <div class="pxc-bg" style="background-image:url('${background_image}')"></div>
            <div class="pxc-avatar"><img src="${profile_image}" /></div>
            <div class="pxc-subcard">
                <div class="pxc-title"><i class="fas fa-hand-holding-usd fa-border" onclick='tip("${link}", "${author}")'></i> <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> ${title}</div>
                <div class="pxc-sub">${description} - ${trending_score}</div>
              <div class="bottom-row">
                <a href='${link}' class='button1'>${link}</a>  &nbsp - ${votes} Votes - ${comments} Comments - ${date}
              </div>
            </div>
          </div>`
          document.getElementById('display').innerHTML += html
        }
        document.getElementById("loaders").remove();
      }
      else {
        alert('API Call failed, try again!')
      }
    }
  });
}

function trendingScoreCalculator(result){
  ///var current_time = new Date().getTime()
  //var post_age_hours = (current_time - Number(result.time)/1000*60*60) //post age in hours
  var trending_score = result.votes
  return trending_score;
}


function getAccountProfile(){
  Swal.fire({
  title: 'Enter account name!',
  input: 'text',
  inputPlaceholder: 'Hive username',
  showCancelButton: true,
  inputValidator: (value) => {
    if (!value) {
      return 'You need to write something!'
    } else {
      window.location.href = '/profile?account='+value
    }
  }
})
}

function tip(link, username){
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2']
  }).queue([
    {
      title: 'Amount',
      text: 'How much HIVE would you like to tip?'
    },
    {
      title: 'Message',
      text: 'Say something nice!'
    }
    ]).then((result) => {
    if (result.value) {
      var amount = parseFloat(result.value[0]).toFixed(3)
      var memo = result.value[1] + ' [HiveSharer Tip]'
      hive_keychain.requestTransfer('', username, amount, memo, 'HIVE', function(response) {
        console.log(response);
      });
      Swal.fire({
        title: 'All done!',
        html: `
          Pay with Keychain for Hive:
          <pre><code>${amount} HIVE</code> to <code>${username}</code> with memo <br><code>${memo}</code>!</pre>
        `,
        confirmButtonText: 'Done!'
      })
    }
  })
}

setTimeout(() => {
  if(window.hive_keychain) {
    var user = window.localStorage.getItem('name');
    if(!user){
      Swal.fire({
      title: 'Enter your Hive Username',
      input: "If you don't enter username, you won't be able to vote, post, comment...",
      input: 'text',
      inputPlaceholder: 'Hive username',
      showCancelButton: false,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        } else {
          window.localStorage.setItem('name', value);
        }
      }
    })
    }
  } else {
      Swal.fire({
        title: 'Keychain',
        html: 'You need Hive Keychain to vote, post, comment or tip!',
        confirmButtonText: 'I understand!'
      })
  }
}, 2000)


function submitVote(id){
  var time = new Date().getTime()
  var user = window.localStorage.getItem('name');
  var json = '{"type": "vote", "voter": "'+user+'", "time": "'+time+'", "parent_id": "'+id+'"}'
  hive_keychain.requestCustomJson(user, 'hive_sharer', 'Posting', json, 'Vote', function(response) {
  	console.log(response.success);
    if(response.success == true){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your vote has been sent',
        showConfirmButton: false,
        timer: 2000
      })
    }
  });
}

function newPost(){
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3']
  }).queue([
    {
      title: 'Link',
      text: 'Enter website link you want to share!'
    },
    {
      title: 'Description',
      text: 'Enter custom description!'
    },
    {
      title: 'Tag',
      text: 'Enter one tag!'
    }
    ]).then((result) => {
    if (result.value) {
      var link = result.value[0]
      var desc = result.value[1]
      var tag = result.value[2]
      var time = new Date().getTime()
      var user = window.localStorage.getItem('name');
      var json = '{"type": "post", "author": "'+user+'", "link": "'+link+'","description": "'+desc+'", "time": "'+time+'", "tags": "'+tag+'"}'
      hive_keychain.requestCustomJson(user, 'hive_sharer', 'Posting', json, 'Post', function(response) {
        if(response.success == true){
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your post has been sent',
            showConfirmButton: false,
            timer: 2000
          })
        }
      });
      Swal.fire({
        title: 'All done!',
        html: `
          Submit post:
          <pre><code>${link}</code> with description: <br> <code>${desc}</code>!</pre>
        `,
        confirmButtonText: 'Done!'
      })
    }
  })
}
