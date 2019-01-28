const User = require('../../models/User')
const UserSession = require('../../models/UserSession')


function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
module.exports = (app) => {
  // app.get('/api/counters', (req, res, next) => {
  //   Counter.find()
  //     .exec()
  //     .then((counter) => res.json(counter))
  //     .catch((err) => next(err));
  // });

  // app.post('/api/counters', function (req, res, next) {
  //   const counter = new Counter();

  //   counter.save()
  //     .then(() => res.json(counter))
  //     .catch((err) => next(err));
  // });
  app.post('/api/signup', (req, res, next) => {
    const {
      body
    } = req;
    const {
      password,
      password2
    } = body;
    let {
      email
    } = body;
    if (!email) {
      return res.send({
        success: false,
        message: 'Email is left blank'
      });
    }
    email = email.toLowerCase();
    if (!validateEmail(email)) {
      return res.send({
        success: false,
        message: 'Invalid Email'
      })
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Password is left blank'
      });
    }
    if (password != password2) {
      return res.send({
        success: false,
        message: 'Password does not match'
      })
    }

    User.find({
      email: email
    }, (err, previousUser) => { //check if there is a previous user with the same email
      if (err) {
        return res.send({
          success: false,
          message: 'Server Error'
        });
      } else if (previousUser.length > 0) {
        return res.send({
          success: false,
          message: 'Account already signed up'
        });
      }
      //when all required slots are filled and correct, the account will be saved to the database
      const newUser = new User();
      newUser.email = email
      newUser.password = password
      newUser.save((err) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Problem saving account'
          });
        }
        return res.send({
          success: true,
          message: 'Signed up!'
        })
      });

    });
  });

  app.post('/api/signin', (req, res, next) => {
    const {
      body
    } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;
    if (!email) {
      return res.send({
        success: false,
        message: 'Email is left blank'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Password is left blank'
      });
    }
    email = email.toLowerCase();
    User.find({
      email: email,
      isApproved: true
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      }

      if (users.length == 0) {
        return res.send({
          success: false,
          message: 'Incorrect Email/Password or Unapproved account'
        });
      }
      const user = users[0];
      if (!user.comparePassword(password)) { //checks to make sure password matches
        return res.send({
          success: false,
          message: 'Incorrect Email/Password'
        });
      }

      //when all has passed, a user session will begin
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.isAdmin = user.isAdmin;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Server Error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed in',
          token: doc._id
        });
      });
    });
  });

  app.get('/api/verify', (req, res, next) => {
    const {
      query
    } = req;
    const {
      token
    } = query;
    //figure out if the token is valid for usage

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: No current session'
        });
      }
      return res.send({
        success: true,
        isAdmin: sessions[0].isAdmin,
        message: 'In current session'
      })
    });
  });

  app.get('/api/signout', (req, res, next) => {
    const {
      query
    } = req;
    const {
      token
    } = query;
    //figure out if the token is valid for usage

    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted: true
      }
    }, null, (err, deletion) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Deleted'
      });
    });
  });

  app.post('/api/approval', (req, res, next) => {
    const {
      body
    } = req;
    const {
      isAdmin,
      isApproved
    } = body;
    let {
      email
    } = body;
    if (!email) {
      return res.send({
        success: false,
        message: 'Email is left blank'
      });
    }

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      }
      if (users.length == 0) {
        return res.send({
          success: false,
          message: 'Incorrect Email'
        });
      }
      User.findOneAndUpdate({
          email: email
        }, {
          $set: {
            isAdmin: isAdmin,
            isApproved: isApproved
          }
        },
        null,
        (err, approval) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Error: Server error'
            });
          }
          return res.send({
            success: true,
            message: 'Approved'
          });
        });
    });
  });


}