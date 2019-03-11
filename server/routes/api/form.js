const GearCheckout = require('../../models/GearCheckout');
const Gear = require('../../models/Gear');
const ReturnGear = require('../../models/ReturnGear');
const Member = require('../../models/Member');
const UserSession = require('../../models/UserSession');
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
module.exports = (app) => {

  /*
  API call for a post request to the Mongo database 
  */
  app.post('/api/checkoutgear', (req, res) => {
    const {
      body
    } = req;
    var allGear = [];
    var i, j, quantity;
    const {
      firstName,
      lastName,
      id,
      phoneNumber,
      gears,
      ccNumber,
      ccSecurityNumber,
      ccExpMonth,
      ccExpYear,
      returnDate,
      barcodes
    } = body;
    let {
      email
    } = body;
    if (!firstName) {
      return res.send({
        success: false,
        message: 'First name is left blank'
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Last name is left blank'
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: 'Email is left blank'
      });
    }
    if (returnDate ==='') {
      return res.send({
        success: false,
        message: 'Return date is left blank'
      });
    }
    email = email.toLowerCase();
    if (!validateEmail(email)) {
      return res.send({
        success: false,
        message: 'Invalid Email'
      })
    }
    if (!id) {
      return res.send({
        success: false,
        message: 'Student ID is left blank'
      });
    }
    if (!phoneNumber || phoneNumber.length != 10) {
      return res.send({
        success: false,
        message: 'Incorrect phone number'
      });
    }
    if (!ccNumber || ccNumber.length < 16) {
      return res.send({
        success: false,
        message: 'Incorrect credit card number'
      });
    }
    if (!ccSecurityNumber) {
      return res.send({
        success: false,
        message: 'Security number is left blank'
      });
    }
    if (!ccExpMonth) {
      return res.send({
        success: false,
        message: 'Expiration month is left blank'
      });
    }
    if (!ccExpYear) {
      return res.send({
        success: false,
        message: 'Expiration year is left blank'
      });
    }
    Member.find({
      email: email
    }, (err, memberFound) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server Error'
        });
      }
      if (memberFound.length != 1) {
        return res.send({
          success: false,
          message: 'Member not found, please recheck email'
        });
      }
      GearCheckout.find({
        email: email,
        checkedBack: false
      }, async (err, previousUser) => { //check if there is other equipment already checked out
        if (err) {
          return res.send({
            success: false,
            message: 'Server Error'
          });
        } else if (previousUser.length > 0) {
          return res.send({
            success: false,
            message: 'Other equipment has been checked out'
          });
        }
        //when all required slots are filled and correct, the account will be saved to the database
        const newCheckout = new GearCheckout();
        newCheckout.email = email;
        newCheckout.firstName = firstName;
        newCheckout.lastName = lastName;
        newCheckout.phoneNumber = phoneNumber;
        newCheckout.ccNumber = ccNumber;
        newCheckout.ccExpMonth = ccExpMonth;
        newCheckout.ccExpYear = ccExpYear;
        newCheckout.ccSecurityNumber = ccSecurityNumber;
        newCheckout.gearReturnDate = returnDate;
        newCheckout.id = id;
        if(gears.length != 0){
        for (i = 0; i < gears.length; i++) {
          var gear = gears[i]
          if (!gear.gearName) {
            return res.send({
              success: false,
              message: 'Empty gear spot'
            });
          }
          if (!gear.gearType) {
            return res.send({
              success: false,
              message: 'Gear type is left empty'
            });
          }
          if (!gear.quantity) {
            return res.send({
              success: false,
              message: 'Quantity is left empty'
            });
          }
          if (!gear.gearDescription) {
            return res.send({
              success: false,
              message: 'Gear description is left empty'
            });
          }if (!gear.gearCondition) {
            return res.send({
              success: false,
              message: 'Gear condition is left empty'
            });
          }
          try {
            let amountAvailable = await Gear.find({
              gearName: gear.gearName,
              gearType: gear.gearType,
              gearDescription: gear.gearDescription,
              gearCondition: gear.gearCondition,
              removed:false,
              checkedOut: false
            });
            if (amountAvailable.length < gear["quantity"]) {
              return res.send({
                success: false,
                message: 'Not enough inventory'
              });
            }
          } catch (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }
        }

        for (i = 0; i < gears.length; i++) {
          var gear = gears[i];
          try {
            for (j = 0; j < gear["quantity"]; j++) {
              tempGear = {
                gearName: gear.gearName,
                gearType: gear.gearType,
                gearDescription :gear.gearDescription,
                gearCondition : gear.gearCondition
              };
              let foundGear = await Gear.findOneAndUpdate({
                  gearName: gear.gearName,
                  gearType: gear.gearType,
                  gearDescription : gear.gearDescription,
                  gearCondition : gear.gearCondition,
                  checkedOut: false,
                  removed:false
                }, {
                  $set: {
                    checkedOut: true
                  }
                },
                null);
              tempGear['gearPrice'] = foundGear.gearPrice;
              tempGear['gearId'] = foundGear._id;
              allGear.push(tempGear);
            }
          } catch (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }
        }
        }

        for (i = 0; i < barcodes.length; i++) {
          var barcode = barcodes[i]
          if (!barcode) {
            return res.send({
              success: false,
              message: 'Barcode left empty'
            });
          }
          try {
            let amountAvailable = await Gear.find({
              barcode: barcode,
              removed:false,
              checkedOut: false
            });
            if (amountAvailable.length != 1) {
              return res.send({
                success: false,
                message: 'Wrong barcode'
              });
            }
          } catch (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }
        }

        for (i = 0; i < barcodes.length; i++) {
          var barcode = barcodes[i];
          try {
          var foundGear = await Gear.findOneAndUpdate({
                  barcode:barcode,
                  checkedOut: false,
                  removed:false
                }, {
                  $set: {
                    checkedOut: true
                  }
                },
                null);
          tempGear = {
                gearName: foundGear.gearName,
                gearType: foundGear.gearType,
                gearDescription :foundGear.gearDescription,
                gearCondition : foundGear.gearCondition,
                gearPrice : foundGear.gearPrice,
                barcode : foundGear.barcode,
                gearId:foundGear._id
              };
          allGear.push(tempGear);
          } catch (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }     
        }

        newCheckout.gears = allGear;
        newCheckout.save((err) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Problem checking out gear'
            });
          }
          return res.send({
            success: true,
            message: 'Gear gone!'
          })
        });

      });

    });
  });

  app.post('/api/addgear', async (req, res, next) => {
    const {
      body
    } = req;
    const {
      gearName,
      gearPrice,
      gearType,
      gearDescription,
      gearCondition,
      barcode
    } = body;
    if (!gearName) {
      return res.send({
        success: false,
        message: 'Gear name is left blank'
      });
    }
    if (!gearPrice) {
      return res.send({
        success: false,
        message: 'Price is left blank'
      });
    }
    if (!gearType) {
      return res.send({
        success: false,
        message: 'Gear type is left blank'
      });
    }
    if (!gearDescription) {
      return res.send({
        success: false,
        message: 'Gear description is left blank'
      });
    }
    if (!gearCondition) {
      return res.send({
        success: false,
        message: 'Gear condition is left blank'
      });
    }
    const newGear = new Gear();
    newGear.gearName = gearName;
    newGear.gearType = gearType;
    newGear.gearPrice = gearPrice;
    newGear.gearDescription = gearDescription;
    newGear.gearCondition = gearCondition;
    newGear.barcode = barcode;
    try {
        let amountAvailable = await Gear.find({
              barcode:barcode,
              removed:false,
              checkedOut: false
            });
            if (amountAvailable.length != 0) {
              return res.send({
                success: false,
                message: 'Barcode already in the system'
              });
            }
          } catch (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
    }

    newGear.save((err) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Problem saving gear'
        });
      }
      return res.send({
        success: true,
        message: 'Gear saved!'
      });
    });
  });

  app.post('/api/returngear', async (req, res, next) => {
    const {
      body
    } = req;
    var check = false;
    const {
      checkoutId,
      comment,
      gearInfo,
      firstName,
      lastName,
      gears
    } = body;
    for (const [key, value] of Object.entries(gearInfo)) {
      if (!value) {
        return res.send({
          success: false,
          message: 'Condition is left blank'
        });
      }
    }
    try {
      for (const [key, value] of Object.entries(gearInfo)) {
        console.log(key);
        console.log(value);
        if (value == 'normal') {
          await Gear.findOneAndUpdate({
              _id: key
            }, {
              $set: {
                checkedOut: false,
                removed:false
              }
            },
            null);
        } else {
          if (!comment) {
            return res.send({
              success: false,
              message: 'Please comment on what is damaged or lost'
            });
          }
          await Gear.findOneAndUpdate({
              _id: key
            }, {
              $set: {
                checkedOut: false,
                removed:true
              }
            },
            null);
        }
      }
      if (comment) {
        const gearWithComment = new ReturnGear();
        gearWithComment.comment = comment;
        gearWithComment.checkoutId = checkoutId;
        gearWithComment.gearInfo = gearInfo;
        gearWithComment.firstName = firstName;
        gearWithComment.lastName =lastName;
        gearWithComment.gears = gears;
        let check = await ReturnGear.find({checkoutId:checkoutId});
        if(check.length != 1){
          await gearWithComment.save();
        }
        else{
          await ReturnGear.findOneAndUpdate({
            checkoutId:checkoutId
          },{$set:{comment:comment,gearInfo}}, null);
        }
      }
      await GearCheckout.findOneAndUpdate({
          _id: checkoutId
        }, {
          $set: {
            checkedBack: true,
          }
        },
        null);
      return res.send({
        success: true,
        message: 'Gear returned!'
      });
    } catch (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
  });

  app.get('/api/attaininfo', (req, res, next) => {
    const {
      query
    } = req;
    const {
      email
    } = query;
    //figure out if the token is valid for usage
    if (!email) {
      return res.send({
        success: false,
        message: 'Email name is left blank'
      });
    }
    if(!validateEmail(email.toLowerCase())){
      return res.send({
        success: false,
        message: 'Email name is invalid'
      });
    }
    GearCheckout.find({
      email: email,
      checkedBack: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Could not find checkout form with this email'
        });
      }
      return res.send({
        success: true,
        info: sessions[0],
      });
    });
  });

  app.post('/api/gearcount', async (req, res, next) => {
    const {
      body
    } = req;
    const {
      gears
    } = body;
    //figure out if the token is valid for usage
    var i;
    gearCount = [];
    try {
      for (i = 0; i < gears.length; i++) {
        value = await Gear.find({
          gearName: gears[i],
          checkedOut: false,
          removed:false
        });
        var gear = {
          name: gears[i],
          count: value.length
        };
        gearCount.push(gear);
      }
      return res.send({
        success: true,
        itemList: gearCount
      });
    } catch (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
  });

  app.post('/api/addmember', (req, res, next) => {
    const {
      body
    } = req;
    const {
      firstName,
      lastName,
      id,
      phoneNumber
    } = body;
    let {email} = body;
    //figure out if the token is valid for usage
    if (!firstName) {
      return res.send({
        success: false,
        message: 'First name is left blank'
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: 'Last name is left blank'
      });
    }
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
    if (!id) {
      return res.send({
        success: false,
        message: 'ID is left blank'
      });
    }
    if (!phoneNumber) {
      return res.send({
        success: false,
        message: 'Phone number is left blank'
      });
    }
    Member.find({
      email: email
    }, (err, previousMember) =>{
      if (err) {
        return res.send({
          success: false,
          message: 'Server Error'
        });
      }
      if(previousMember.length > 0){
        return res.send({
          success: false,
          message: 'Member has already been added'
        });
      }
      const newMember = new Member();
      newMember.firstName = firstName;
      newMember.lastName = lastName;
      newMember.phoneNumber = phoneNumber;
      newMember.id = id;
      newMember.email = email;
      newMember.save((err) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Problem saving member'
          });
        }
        return res.send({
          success: true,
          message: 'Member is now registered'
        });
      });
    });
  });

  app.get('/api/latemember', (req, res, next) => {
    //figure out if the token is valid for usage
    const {
      query
    } = req;
    const {
      token
    } = query;
    const currentDate = new Date();
    var results = [];
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error'
        });
      }
      if (sessions[0].isAdmin) {
        GearCheckout.find({
          checkedBack: false
        }, (err, allLate) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }
          if (!allLate.length) {
            return res.send({
              success: false,
              message: 'Currently no members are overdue'
            });
          }
          var i;
          for (i = 0; i < allLate.length; i++) {
            if ((allLate[i].gearReturnDate.getTime() <= currentDate.getTime())) {
              results.push(allLate[i]);
            }
          }
          return res.send({
            success: true,
            results: results
          });
        })
      }
    });
  });

  app.get('/api/checkedout', (req, res, next) => {
    //figure out if the token is valid for usage
    const {
      query
    } = req;
    const {
      token
    } = query;
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error'
        });
      }
      if (sessions[0].isAdmin) {
        GearCheckout.find({
          checkedBack: false
        }, (err, gear_checkedout) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }
          if (!gear_checkedout.length) {
            return res.send({
              success: false,
              message: 'Currently no gear is checked out'
            });
          }
          return res.send({
            success: true,
            results: gear_checkedout,
          });
        })
      }
    });
  });

  app.get('/api/gearavailable', (req, res, next) => {
    //figure out if the token is valid for usage
    const {
      query
    } = req;
    const {
      token
    } = query;
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error'
        });
      }
      if (sessions[0].isAdmin) {
        Gear.find({
          checkedOut: false,
          removed:false
        }, (err, gear_available) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }
          if (!gear_available.length) {
            return res.send({
              success: false,
              message: 'Currently all gear is checked out'
            });
          }
          return res.send({
            success: true,
            results: gear_available,
          });
        })
      }
    });
  });

  app.get('/api/returnforms', (req, res, next) => {
    //figure out if the token is valid for usage
    const {
      query
    } = req;
    const {
      token
    } = query;
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error'
        });
      }
      if (sessions[0].isAdmin) {
        ReturnGear.find({
          cleared: false
        }, (err, returned_gear) => {
          if (err) {
            return res.send({
              success: false,
              message: 'Server Error'
            });
          }
          if (!returned_gear.length) {
            return res.send({
              success: false,
              message: 'All return comments have been cleared'
            });
          }
          return res.send({
            success: true,
            results: returned_gear
          });
        })
      }
    });
  });

  app.post('/api/clearreturngear', async (req, res, next) => {
    const {
      body
    } = req;
    const {
      checkoutId,
      comment,
      gearInfo
    } = body;
    for (const [key, value] of Object.entries(gearInfo)) {
      if (!value) {
        return res.send({
          success: false,
          message: 'Condition is left blank'
        });
      }
    }
    try {
      for (const [key, value] of Object.entries(gearInfo)) {
        console.log(key);
        console.log(value);
        if (value == 'normal') {
          await Gear.findOneAndUpdate({
              _id: key
            }, {
              $set: {
                checkedOut: false,
                removed:false
              }
            },
            null);
        } else {
          await Gear.findOneAndUpdate({
              _id: key
            }, {
              $set: {
                checkedOut: false,
                removed:true
              }
            },
            null);
        }
      }
      await ReturnGear.findOneAndUpdate({checkoutId:checkoutId, cleared:false}, {$set:{cleared:true, comment:comment}},null);
      await GearCheckout.findOneAndUpdate({
          _id: checkoutId
        }, {
          $set: {
            checkedBack: true,
          }
        },
        null);
      return res.send({
        success: true,
        message: 'Gear returned!'
      });
    } catch (err) {
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
  });

  app.get('/api/damagedsheet', (req, res, next) => {
    //figure out if the token is valid for usage
    const {
      query
    } = req;
    const {
      token
    } = query;
    var results = [];
    UserSession.find({
      _id: token,
      isDeleted: false
    }, async (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Server error'
        });
      } else if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error'
        });
      }
      try{
      if (sessions[0].isAdmin) {
        let allReturns = await ReturnGear.find({cleared:false});
        var i;
        for(i =0 ; i<allReturns.length ; i++){
          let memberInfo = await GearCheckout.find({_id:allReturns[i].checkoutId});
          var damagedGear = [];
          var gearInfo = allReturns[i].gearInfo;
          for (const [key, value] of Object.entries(gearInfo)) {
            console.log(key);
            console.log(value);
            if(value != 'normal'){
              let gear = await Gear.find({_id : key});
              damagedGear.push(gear[0]);
            }
          }
          console.log(damagedGear);
          memberInfo[0]['damagedGear'] = damagedGear;
          console.log(memberInfo[0]);
          results.push(memberInfo[0]);
        }
        return res.send({
          success: true,
          results:results
        });
      }
    }catch(err){
      return res.send({
        success: false,
        message: 'Error: Server error'
      });
    }
    });
  });
}

