function displayTime(time){
  let date_raw = new Date(Number(time)) + ''
  let date = date_raw.split('(')[0] + '<br> (' + date_raw.split('(')[1]
  Swal.fire({
    html: date,
    showCancelButton: false,
  })
}

function displayPost(time, link, author, id, title, description, votes, comments){
  var modal = `<!-- The Modal -->
      <div id="myModal" class="modal">
        <!-- Modal content -->
        <div class="modal-content">
          <div class="modal-header">
            <span class="close">&times;</span>
            <h2><a class='link' href='${link}'>${title}</a></h2>
          </div>
          <div class="modal-body">
            <p>${description}</p>
          </div>
          <div class="modal-footer">
            <h3><a class='link' href='/profile?account=${author}'>${author}</a> - <a onclick="displayTime('${time}')">${moment.unix(time / 1000).fromNow()}</a> - ${votes} Votes <i class="fas fa-arrow-up fa-border" onclick=submitVote("${id}")></i> - ${comments} Comments <i class="fas fa-comment fa-border" onclick=comment("${id}")></i></h3>
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
            list_comments += `<div class="modal-comment"><a class='link' href="/profile?account=${result[i].author}" > ${result[i].author}</a> - ${result[i].description} - (${moment.unix(Number(result[i].time) / 1000).fromNow()})</div>`
          } else {
            list_comments += `<div class="modal-comment bottom-border"><a class='link' href="/profile?account=${result[i].author}" > ${result[i].author}</a> - ${result[i].description} - (${moment.unix(Number(result[i].time) / 1000).fromNow()})</div>`
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
    inputAttributes: {
      maxlength: 100
    },
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
      input: 'text',
      text: 'How much HIVE would you like to tip (e.g. 0.500)?'
    },
    {
      title: 'Message',
      inputAttributes: {
        maxlength: 100
      },
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
