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
  document.title = "HiveSharer - New";
  $.ajax({
    url: '/api/posts?page='+page,
    contentType: "application/json",
    dataType: 'json',
    success: async function(result){
      //console.log("API result: " + JSON.stringify(result))
      if(JSON.stringify(result) != '{"success":false}') {
        //sort array by time of creation, new on the top
        var sorted = result.sort((a,b)=> parseFloat(b.time) - parseFloat(a.time))
        document.getElementById('display').innerHTML = ''
        for(i=0;i<result.length;i++){
          var {success, background_image, profile_image, time, link, author, id, title, description, votes, comments} = sorted[i]
          var html = `<div class="plx-card silver">
            <div class="pxc-bg" style="background-image:url('${background_image}')"></div>
            <div class="pxc-avatar"><a href='/profile?account=${author}'><img src="${profile_image}" /></a></div>
            <div class="pxc-subcard">
                <div class="pxc-title"><i class="fas fa-hand-holding-usd fa-border" onclick='tip("${link}", "${author}")'></i> <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> <a class='underline' onclick='displayPost("${background_image}", "${profile_image}", "${time}", "${link}", "${author}", "${id}", "${title}", "${description}", "${votes}", "${comments}")'>${title}</a></div>
                <div class="pxc-sub"><a href='/profile?account=${author}'>@${author}</a> - ${description}</div>
              <div class="bottom-row">
                <a href='${link}' class='button1'>${link}</a>  &nbsp - ${votes} Votes - ${comments} Comments -&nbsp <a onclick="displayTime('${time}')"> ${moment.unix(Number(time) / 1000).fromNow()}</a>
              </div>
            </div>
          </div>`
          document.getElementById('display').innerHTML += html
          let load_button = `<center><button class="profile-card__button button--orange" onclick="loadMore('${page}')">Load More</button></center>`
          document.getElementById('load').innerHTML = load_button
        }
        document.getElementById("loaders").remove();
        document.title = "HiveSharer - New";
      }
      else {
        alert('API Call failed, try again! / No more posts!')
        console.log("API result: " + JSON.stringify(result))
      }
    }
  });
}

var loadMoreClicks = 1
function loadMore(page){
  console.log(loadMoreClicks)
  if(loadMoreClicks == 1){
    let page_num = Number(page)+1
    document.getElementById('load').innerHTML = ''
    $.ajax({
      url: '/api/posts?page='+page_num,
      contentType: "application/json",
      dataType: 'json',
      success: function(result){
        //console.log("API result: " + JSON.stringify(result))
        if(JSON.stringify(result) != '{"success":false}') {
          //sort array by time of creation, new on the top
          var sorted = result.sort((a,b)=> parseFloat(b.time) - parseFloat(a.time))
          for(i=0;i<result.length;i++){
            var {success, background_image, profile_image, time, link, author, id, title, description, votes, comments} = sorted[i]
            var html = `<div class="plx-card silver">
              <div class="pxc-bg" style="background-image:url('${background_image}')"></div>
              <div class="pxc-avatar"><a href='/profile?account=${author}'><img src="${profile_image}" /></a></div>
              <div class="pxc-subcard">
                  <div class="pxc-title"><i class="fas fa-hand-holding-usd fa-border" onclick='tip("${link}", "${author}")'></i> <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> <a class='underline' onclick='displayPost("${background_image}", "${profile_image}", "${time}", "${link}", "${author}", "${id}", "${title}", "${description}", "${votes}", "${comments}")'>${title}</a></div>
                  <div class="pxc-sub"><a href='/profile?account=${author}'>@${author}</a> - ${description}</div>
                <div class="bottom-row">
                  <a href='${link}' class='button1'>${link}</a>  &nbsp - ${votes} Votes - ${comments} Comments -&nbsp <a onclick="displayTime('${time}')"> ${moment.unix(Number(time) / 1000).fromNow()}</a>
                </div>
              </div>
            </div>`
            document.getElementById('display').innerHTML += html
            let load_button = `<center><button class="profile-card__button button--orange" onclick="loadMore('${page}')">Load More</button></center>`
            document.getElementById('load').innerHTML = load_button
            loadMoreClicks += 1
          }
          document.getElementById("loaders").remove();
          document.title = "HiveSharer - New";
        }
        else {
          alert('API Call failed, try again! / No more posts!')
          console.log("API result: " + JSON.stringify(result))
          document.title = "HiveSharer - New";
        }
      }
    });
  } else {
    let page_num = Number(loadMoreClicks)+1
    document.getElementById('load').innerHTML = ''
    $.ajax({
      url: '/api/posts?page='+page_num,
      contentType: "application/json",
      dataType: 'json',
      success: function(result){
        //console.log("API result: " + JSON.stringify(result))
        if(JSON.stringify(result) != '{"success":false}') {
          //sort array by time of creation, new on the top
          var sorted = result.sort((a,b)=> parseFloat(b.time) - parseFloat(a.time))
          for(i=0;i<result.length;i++){
            var {success, background_image, profile_image, time, link, author, id, title, description, votes, comments} = sorted[i]
            var html = `<div class="plx-card silver">
              <div class="pxc-bg" style="background-image:url('${background_image}')"></div>
              <div class="pxc-avatar"><a href='/profile?account=${author}'><img src="${profile_image}" /></a></div>
              <div class="pxc-subcard">
                  <div class="pxc-title"><i class="fas fa-hand-holding-usd fa-border" onclick='tip("${link}", "${author}")'></i> <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> <a class='underline' onclick='displayPost("${background_image}", "${profile_image}", "${time}", "${link}", "${author}", "${id}", "${title}", "${description}", "${votes}", "${comments}")'>${title}</a></div>
                  <div class="pxc-sub"><a href='/profile?account=${author}'>@${author}</a> - ${description}</div>
                <div class="bottom-row">
                  <a href='${link}' class='button1'>${link}</a>  &nbsp - ${votes} Votes - ${comments} Comments -&nbsp <a onclick="displayTime('${time}')"> ${moment.unix(Number(time) / 1000).fromNow()}</a>
                </div>
              </div>
            </div>`
            document.getElementById('display').innerHTML += html
            let load_button = `<center><button class="profile-card__button button--orange" onclick="loadMore('${page}')">Load More</button></center>`
            document.getElementById('load').innerHTML = load_button
            loadMoreClicks += 1
          }
          document.getElementById("loaders").remove();
          document.title = "HiveSharer - New";
        }
        else {
          alert('API Call failed, try again! / No more posts!')
          console.log("API result: " + JSON.stringify(result))
          document.title = "HiveSharer - New";
        }
      }
    });
  }
}

function displayTime(time){
  let date_raw = new Date(Number(time)) + ''
  let date = date_raw.split('(')[0] + '<br> (' + date_raw.split('(')[1]
  Swal.fire({
    html: date,
    showCancelButton: false,
  })
}

function displayPost(background_image, profile_image, time, link, author, id, title, description, votes, comments){
  var modal = `<!-- The Modal -->
      <div id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
          <div class="modal-header">
            <span class="close">&times;</span>
            <h2><a href='${link}'>${title}</a></h2>
          </div>
          <div class="modal-body">
            <p>${description}</p>
          </div>
          <div class="modal-footer">
            <h3><a href='https://hive.blog/@${author}'>${author}</a> - <a onclick="displayTime('${time}')">${moment.unix(time / 1000).fromNow()}</a> - ${votes} Votes <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> - ${comments} Comments <i class="fas fa-comment fa-border" onclick=comment("${id}")></i></h3>
          </div>
          <div id='list_comments'></div>
        </div>
      </div>`
  document.getElementById('modal').innerHTML = modal

  $.ajax({
    url: '/api/comments?id='+id,
    contentType: "application/json",
    dataType: 'json',
    success: function(result){
      if(JSON.stringify(result) != '{"success":false}') {
        let list_comments = ''
        for(i=0;i<result.length;i++){
          //add botton-border to all but last comment
          if(i == result.length-1){
            list_comments += `<div class="modal-comment"><a href="https://hive.blog/@${result[i].author}" > ${result[i].author}</a> - ${result[i].description} - (${moment.unix(Number(result[i].time) / 1000).fromNow()})</div>`
          } else {
            list_comments += `<div class="modal-comment bottom-border"><a href="https://hive.blog/@${result[i].author}" > ${result[i].author}</a> - ${result[i].description} - (${moment.unix(Number(result[i].time) / 1000).fromNow()})</div>`
          }
        }
        $('#list_comments').html(list_comments)
      } else {
        alert('API call failed, cannot load comments / post has 0 comments!')
      }
    }
  })

  var modal = document.getElementById('myModal')
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    document.getElementById('list_comments').innerHTML = ''
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      document.getElementById('list_comments').innerHTML = ''
    }
  }
}

function comment(id){
  Swal.fire({
    title: 'Enter your comment!',
    input: 'text',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write something!'
      } else {
        submitComment(id, value)
      }
    }
  })
}

function submitComment(parent_id, comment){
  Swal.fire({
    position: 'top-end',
    icon: 'info',
    title: 'Sending your comment...',
    showConfirmButton: false,
    timer: 1000
  })
  var time = new Date().getTime()
  var user = window.localStorage.getItem('name');
  var id = 'comment-'+ user + '-' + time + '-hivesharer'
  var json = '{"type": "comment", "author": "'+user+'", "description": "'+comment+'", "time": "'+time+'", "parent_id": "'+parent_id+'", "id": "'+id+'"}'
  hive_keychain.requestCustomJson(user, 'hive_sharer', 'Posting', json, 'Vote', function(response) {
  	console.log(response.success);
    if(response.success == true){
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your comment has been sent',
        showConfirmButton: false,
        timer: 2000
      })
    }
  });
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
      input: 'number',
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
      allowOutsideClick: false,
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
        confirmButtonText: 'I understand!',
        allowOutsideClick: false
      })
  }
}, 2000)


function submitVote(parent_id){
  Swal.fire({
    position: 'top-end',
    icon: 'info',
    title: 'Sending your vote...',
    showConfirmButton: false,
    timer: 1000
  })
  var time = new Date().getTime()
  var user = window.localStorage.getItem('name');
  var id = 'vote-' + user + '-' + time + '-hivesharer'
  var json = '{"type": "vote", "voter": "'+user+'", "time": "'+time+'", "parent_id": "'+parent_id+'", "id": "'+id+'"}'
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

function trending(){
  $.ajax({
    url: '/api/trending',
    contentType: "application/json",
    dataType: 'json',
    success: async function(result){
      //console.log("API result: " + JSON.stringify(result))
      if(JSON.stringify(result) != '{"success":false}') {
        //sort array by time of creation, new on the top
        var sorted = result.sort((a,b)=> parseFloat(b.trending_score) - parseFloat(a.trending_score))
        document.getElementById('display').innerHTML = ''
        for(i=0;i<result.length;i++){
          var {trending_score, background_image, profile_image, time, link, author, id, title, description, votes, comments} = sorted[i]
          let date_raw = new Date(Number(time)) + ''
          let date = (date_raw.split('(')[0]).slice(3)
          var html = `<div class="plx-card silver">
            <div class="pxc-bg" style="background-image:url('${background_image}')"></div>
            <div class="pxc-avatar"><img src="${profile_image}" /></div>
            <div class="pxc-subcard">
                <div class="pxc-title"><i class="fas fa-hand-holding-usd fa-border" onclick='tip("${link}", "${author}")'></i> <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> <a class='underline' onclick='displayPost("${background_image}", "${profile_image}", "${time}", "${link}", "${author}", "${id}", "${title}", "${description}", "${votes}", "${comments}")'>${title}</a></div>
                <div class="pxc-sub"><a href='/profile?account=${author}'>@${author}</a> - ${description}</div>
              <div class="bottom-row">
                <a href='${link}' class='button1'>${link}</a>  &nbsp - ${votes} Votes - ${comments} Comments -&nbsp <a onclick="displayTime('${time}')"> ${moment.unix(Number(time) / 1000).fromNow()}</a>
              </div>
            </div>
          </div>`
          document.getElementById('display').innerHTML += html
        }
        document.title = "HiveSharer - Trending";
        document.getElementById("loaders").remove();
      }
      else {
        alert('API Call failed, try again!')
      }
    }
  });
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

function newPost(){
  Swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3']
  }).queue([
    {
      title: 'Link',
      input: 'url',
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
      var id =  user + '-' + time + '-hivesharer'
      var json = '{"type": "post", "author": "'+user+'", "link": "'+link+'","description": "'+desc+'", "time": "'+time+'", "tags": "'+tag+'", "id": "'+id+'"}'
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

function changeUsername(){
  localStorage.removeItem('name');
  window.location.reload();
}
