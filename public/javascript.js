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
      var memo = result.value[1]
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
      	console.log(response);
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
