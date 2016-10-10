/* API
 * ========================================================================== */
// TODO: wrap all API calls in try / catch?

window.rs.api = {
  root: null,

  /* Init
   * ------------------------------------------------------ */
  init: function() {
    this.root = new Firebase('%%%GRUNT_REPLACE_FIREBASE_ROOT_URL%%%');
  },

  /* Auth
   * ------------------------------------------------------ */
  getAuthData: function() {
    return this.root.getAuth();
  },

  /* ScheduleType
   * ------------------------------------------------------ */
  getIsXYPromise: function() {
    var isXYDef = $.Deferred();

    var isXY = window.sessionStorage.getItem('isXY');

    if (isXY !== null) {
      isXYDef.resolve(isXY === "true");
    }
    else {
      var authData = rs.api.getAuthData();
      if(authData) {
        var isXYRef = rs.api.root.child("accounts").child(authData.uid).child("isXY");

        isXYRef.once(
          'value',
          function (isXY) {
            window.sessionStorage.setItem("isXY", isXY.val());
            isXYDef.resolve(isXY.val());
          },
          function (error) {
            rs.analytics.trackApiError("getIsXYPromise", "couldn't get schedule type", error, {
              firebaseSimulatePath: isXYRef.path.toString(),
              account: authData.uid
            });
            isXYDef.reject(error);
            console.log(error);
          });
      }
      else{
        isXYDef.reject("no authdata");
      }
    }
    return isXYDef.promise();
  },

  /* Account
   * ------------------------------------------------------ */
  getAccountName: function() {
    var authData = rs.api.getAuthData();

    var nameDef = $.Deferred();

    var nameRef = rs.api.root.child("accounts").child(authData.uid).child("name");

    nameRef.once(
      'value',
      function(name) {
        nameDef.resolve(name.val());
      },
      function(error) {
        rs.analytics.trackApiError("getAccountName", "Could not get the account name.", error, {
          firebaseSimulatePath: nameRef.path.toString(),
          account: authData.uid
        });
        nameDef.reject(error);
      });

    return nameDef.promise();
  },

  /* Preferences
   * ------------------------------------------------------ */

  getProgramDetailsAndPrefsPromise: function() {
    var programDetailsAndPrefsDef = $.Deferred();
    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function (programId) {
      var programDAPRef = rs.api.root.child("programs").child(programId).child("programDetailsAndPrefs");

      programDAPRef.once("value",
        function (programDAP) {
          programDetailsAndPrefsDef.resolve(programDAP.val());
        },
        function (error) {
          rs.analytics.trackApiError("getProgramDetailsAndPrefsPromise", "Could not get the program's details and prefs.", error, {
            firebaseSimulatePath: programDAPRef.path.toString(),
            program: programId
          });
          programDetailsAndPrefsDef.reject(error);
        });
    })
    .fail(function(error) {
      programDetailsAndPrefsDef.reject(error);
    });

    return programDetailsAndPrefsDef.promise();
  },

  updateProgramDetailsAndPrefsPromise: function(programDAP) {
    var programDetailsAndPrefsDef = $.Deferred();
    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function (programId) {
      var programDaPRef = rs.api.root.child("programs").child(programId).child("programDetailsAndPrefs");

      programDaPRef.set(programDAP,
        function (error) {
          if(error === null) {
            programDetailsAndPrefsDef.resolve();
          }
          else {
            rs.analytics.trackApiError("updateProgramDetailsAndPrefsPromise", "Could not update the program's details and prefs.", error, {
              firebaseSimulateData: programDAP,
              firebaseSimulatePath: programDaPRef.path.toString(),
              program: programId
            });
            programDetailsAndPrefsDef.reject(error);
          }
        });
    })
    .fail(function(error) {
      programDetailsAndPrefsDef.reject(error);
    });

    return programDetailsAndPrefsDef.promise();
  },

  /* Program
   * ------------------------------------------------------ */
  getProgramIdPromise: function() {
    var programIdDef = $.Deferred();

    var programId = window.sessionStorage.getItem('programId');

    if (programId !== null && programId !== "null") {
      programIdDef.resolve(programId);
    }
    else {
      var authData = rs.api.getAuthData();

      rs.api.root.child('accounts').child(authData.uid).child('programId').once(
        'value',
        function (programId) {
          window.sessionStorage.setItem('programId', programId.val());
          programIdDef.resolve(programId.val());
        },
        function (error) {
          rs.analytics.trackApiError("getProgramIdPromise", "Could not get the program id.", error, {
            program: programId
          });
          programIdDef.reject(error);
        }
      );
    }

    return programIdDef.promise();
  },

  getProgramUIPromise: function() {
    var programUIDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var programUIRef = rs.api.root.child('programs').child(programId).child('ui');
      programUIRef.once(
        'value',
        function(programUI) {
          programUIDef.resolve(programUI.val());
        },
        function(error) {
          rs.analytics.trackApiError("getProgramUIPromise", "Could not get the program UI.", error, {
            firebaseSimulatePath: programUIRef.path.toString(),
            program: programId
          });
          programUIDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      programUIDef.reject(error);
    });

    return programUIDef.promise();
  },

  updateProgramUIPromise: function(programUI, prevStage) {
    var programUIDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var programUIRef = rs.api.root.child('programs').child(programId).child('ui');
      programUIRef.set(
        programUI,
        function(error) {
          if (error === null) {
            rs.analytics.track("Completed " + prevStage + " Stage");
            programUIDef.resolve();
          }
          else {
            rs.analytics.trackApiError("updateProgramUIPromise", "Could not update the program UI.", error, {
              prevStage: prevStage,
              firebaseSimulateData: programUI,
              firebaseSimulatePath: programUIRef.path.toString(),
              program: programId
            });
            programUIDef.reject(error);
          }
        }
      );
    })
    .fail(function(error) {
      programUIDef.reject(error);
    });

    return programUIDef.promise();
  },

  /* Resident
   * ------------------------------------------------------ */
  getResidentsPromise: function() {
    var residentsDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var residentsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('residents');
      residentsRef.once(
        'value',
        function (residents) {
          residents = rs.api.util.buildDataArray(residents.val());
          residentsDef.resolve(residents);
        },
        function (error) {
          rs.analytics.trackApiError("getResidentsPromise", "Could not get the residents list.", error, {
            firebaseSimulatePath: residentsRef.path.toString(),
            program: programId
          });
          residentsDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      residentsDef.reject(error);
    });

    return residentsDef.promise();
  },

  addResident: function(resident) {
    var addDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var residentsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('residents');

      var residentData = rs.util.cloneObj(resident);
      delete residentData.firebaseKey;
      var addedResidentRef = residentsRef.push(residentData, function(error) {
        if (error === null) {
          // UNTODO: unhacked, done in a better way
          var key = addedResidentRef.key();
          addedResidentRef.once(
            'value',
            function(addedResidentSnapshot) {
              var addedResident = this.util.setFirebaseKey(addedResidentSnapshot.val(), key);
              addDef.resolve(addedResident);
            },
            function(error) {
              rs.analytics.trackApiError("addResident", "Could not get the resident after adding.", error, {
                firebaseSimulateData: residentData,
                firebaseSimulatePath: addedResidentRef.path.toString(),
                program: programId,
                residentKey: key
              });
              addDef.reject(error);
            },
            rs.api
          );
        } else {
          rs.analytics.trackApiError("addResident", "Could not add a resident.", error, {
            firebaseSimulateData: residentData
          });
          addDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      addDef.reject(error);
    });

    return addDef.promise();
  },

  updateResident: function(resident) {
    var updateDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var residentRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('residents').child(resident.firebaseKey);

      var residentData = rs.util.cloneObj(resident);
      delete residentData.firebaseKey;

      residentRef.set(residentData, function(error) {
        if (error === null) {
          updateDef.resolve();
        } else {
          rs.analytics.trackApiError("updateResident", "Could not update a resident", error, {
            firebaseSimulateData: residentData,
            firebaseSimulatePath: residentRef.path.toString(),
            program: programId,
            residentKey: resident.firebaseKey
          });
          updateDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      updateDef.reject(error);
    });

    return updateDef.promise();
  },

  deleteResident: function(resident) {
    var deleteDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var residentRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('residents').child(resident.firebaseKey);

      residentRef.set(null, function(error) {
        if (error === null) {
          deleteDef.resolve();
        } else {
          rs.analytics.trackApiError("deleteResident", "Could not delete a resident.", error, {
            firebaseSimulateData: resident,
            firebaseSimulatePath: residentRef.path.toString(),
            program: programId,
            residentKey: resident.firebaseKey
          });
          deleteDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      deleteDef.reject(error);
    });

    return deleteDef.promise();
  },

  /* Rotation
   * ------------------------------------------------------ */
  getRotationsPromise: function() {
    var rotationsDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var rotationsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('rotations');
      rotationsRef.once(
        'value',
        function (rotations) {
          rotations = rs.api.util.buildDataArray(rotations.val());
          rotationsDef.resolve(rotations);
        },
        function (error) {
          rs.analytics.trackApiError("getRotationsPromise", "Could not get the rotations list.", error, {
            firebaseSimulatePath: rotationsRef.path.toString(),
            program: programId
          });
          rotationsDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      rotationsDef.reject(error);
    });

    return rotationsDef.promise();
  },

  addRotation: function(rotation) {
    var addDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var rotationsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('rotations');

      var rotationData = rs.util.cloneObj(rotation);
      delete rotationData.firebaseKey;

      var addedRotationRef = rotationsRef.push(rotationData, function(error) {
        if (error === null) {
          // UNTODO: unhacked, done in a better way
          var key = addedRotationRef.key();
          addedRotationRef.once(
            'value',
            function(addedRotationSnapshot) {
              var addedRotation = this.util.setFirebaseKey(addedRotationSnapshot.val(), key);
              addDef.resolve(addedRotation);
            },
            function(error) {
              rs.analytics.trackApiError("addRotation", "Could not get a rotation after adding.", error, {
                firebaseSimulateData: rotationData,
                firebaseSimulatePath: addedRotationRef.path.toString(),
                program: programId,
                residentKey: key
              });
              addDef.reject(error);
            },
            rs.api
          );
        } else {
          rs.analytics.trackApiError("addRotation", "Could not add a rotation.", error, {
            firebaseSimulateData: rotationData,
            firebaseSimulatePath: addedRotationRef.path.toString(),
            program: programId
          });
          addDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      addDef.reject(error);
    });

    return addDef.promise();
  },

  updateRotation: function(rotation) {
    var updateDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var rotationRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('rotations').child(rotation.firebaseKey);

      var rotationData = rs.util.cloneObj(rotation);
      delete rotationData.firebaseKey;

      rotationRef.update(rotationData, function(error) {
        if (error === null) {
          updateDef.resolve();
        } else {
          rs.analytics.trackApiError("updateRotation", "Could not update a rotation.", error, {
            firebaseSimulateData: rotationData,
            firebaseSimulatePath: rotationRef.path.toString(),
            program: programId,
            rotationKey: rotation.firebaseKey
          });
          updateDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      updateDef.reject(error);
    });

    return updateDef.promise();
  },

  deleteRotation: function(rotation) {
    var deleteDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var rotationRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('rotations').child(rotation.firebaseKey);

      rotationRef.set(null, function(error) {
        if (error === null) {
          deleteDef.resolve();
        } else {
          rs.analytics.trackApiError("deleteRotation", "Could not delete a rotation.", error, {
            firebaseSimulateData: rotation,
            firebaseSimulatePath: rotationRef.path.toString(),
            program: programId,
            rotationKey: rotation.firebaseKey
          });
          deleteDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      deleteDef.reject(error);
    });

    return deleteDef.promise();
  },

  /* Rules
   * ------------------------------------------------------ */

  /* Cohorts
   * ------------------------------------------------------ */
  getCohortMembersPromise: function(cohortId) {
    var cohortDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var residentsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('residents');
      residentsRef.orderByChild('cohort').equalTo(cohortId).once(
        'value',
        function (cohortMembers) {
          cohortDef.resolve(cohortMembers.val());
        },
        function (error) {
          rs.analytics.trackApiError("getCohortMembersPromise", "Could not get a cohort's members.", error, {
            cohortId: cohortId,
            firebaseSimulatePath: residentsRef.path.toString(),
            program: programId
          });
          cohortDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      cohortDef.reject(error);
    });

    return cohortDef.promise();
  },

  getCohortsPromise: function() {
    var cohortsDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var cohortsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('cohorts');
      cohortsRef.once(
        'value',
        function (cohorts) {
          rs.api.getCohortOrder().done(function(cohortOrder) {
            cohorts = cohorts.val();

            //order them properly and building the data array a la fois
            var orderedCohorts = [];
            if (cohortOrder !== null) {
              for (var i = 0; i < cohortOrder.length; i++) {
                var firebaseKey = cohortOrder[i];
                if(cohorts.hasOwnProperty(firebaseKey) && firebaseKey !== "sentinel") {
                  orderedCohorts[i] = cohorts[firebaseKey];
                  orderedCohorts[i].firebaseKey = firebaseKey;
                }
                else {
                  // TODO: logging
                  console.log("so why is it in the ordeR? " + firebaseKey);
                }
              }
            }
            else {
              orderedCohorts = rs.api.util.buildDataArray(cohorts);
            }
            cohortsDef.resolve({ cohorts: orderedCohorts, cohortOrder : cohortOrder});
          })
          .fail(function(error) {
            cohortsDef.reject(error);
          });
        },
        function (error) {
          rs.analytics.trackApiError("getCohortsPromise", "Could not get the cohorts list.", error, {
            firebaseSimulatePath: cohortsRef.path.toString(),
            program: programId
          });
          cohortsDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      cohortsDef.reject(error);
    });

    return cohortsDef.promise();
  },

  addCohort: function(cohort) {
    var addDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var cohortsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('cohorts');

      var cohortData = rs.util.cloneObj(cohort);
      delete cohortData.firebaseKey;

      var addedCohortRef = cohortsRef.push(cohortData, function(error) {
        if (error === null) {
          var key = addedCohortRef.key();
          addedCohortRef.once(
            'value',
            function(addedCohortSnapshot) {
              var addedCohort = this.util.setFirebaseKey(addedCohortSnapshot.val(), key);

              rs.api.getCohortOrder().done(function(cohortOrder) {
                var cohortOrder = (cohortOrder === null || cohortOrder === "") ? [] : cohortOrder;
                cohortOrder.push(addedCohort.firebaseKey);

                rs.api.setCohortOrderRaw(cohortOrder).done(function() {
                  addDef.resolve(addedCohort);
                })
                .fail(function(error) {
                  addDef.reject(error);
                });
              })
              .fail(function(error) {
                addDef.reject(error);
              });
            },

            function(error) {
              rs.analytics.trackApiError("addCohort", "Could not get a cohort after adding.", error, {
                firebaseSimulateData: cohortData,
                firebaseSimulatePath: addedCohortRef.path.toString(),
                program: programId,
                cohortKey: key
              });
              addDef.reject(error);
            },
            rs.api // context
          );
        } else {
          rs.analytics.trackApiError("addCohort", "Could not add a cohort.", error, {
            firebaseSimulateData: cohortData
          });
          addDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      addDef.reject(error);
    });

    return addDef.promise();
  },

  // TODO: change setCohortOrder calls to this and rename
  setCohortOrderRaw: function(order) {
    order.unshift("sentinel");
    var setOrderDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var cohortOrderRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('cohortOrder');

      cohortOrderRef.set(order, function(error) {
        if (error === null) {
          setOrderDef.resolve();
        } else {
          rs.analytics.trackApiError("setCohortOrderRaw", "Could not set the cohort order.", error, {
            cohortOrderData: order,
            firebaseSimulatePath: cohortOrderRef.path.toString(),
            program: programId
          });
          setOrderDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      setOrderDef.reject(error);
    });

    return setOrderDef.promise();
  },

  setCohortOrder: function(order) {
    // TODO: Variable named order is confusing- it appears to be an array of
    //       cohorts, but the name indicates just the order directly.
    var orderKeys = ['sentinel'];
    for(var i=0; i < order.length; i++) {
      orderKeys.push(order[i].firebaseKey);
    }
    var setOrderDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var cohortOrderRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('cohortOrder');

      cohortOrderRef.set(orderKeys, function(error) {
        if (error === null) {
          setOrderDef.resolve();
        } else {
          rs.analytics.trackApiError("setCohortOrder", "Could not set the cohort order.", error, {
            firebaseSimulateData: orderKeys,
            firebaseSimulatePath: cohortOrderRef.path.toString(),
            program: programId
          });
          setOrderDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      setOrderDef.reject(error);
    });

    return setOrderDef.promise();
  },

  updateCohort: function(cohort) {
    var updateDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var cohortRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('cohorts').child(cohort.firebaseKey);

      var cohortData = rs.util.cloneObj(cohort);
      delete cohortData.firebaseKey;

      cohortRef.update(cohortData, function(error) {
        if (error === null) {
          updateDef.resolve();
        } else {
          rs.analytics.trackApiError("updateCohort", "Could not update a cohort.", error, {
            firebaseSimulateData: cohortData,
            firebaseSimulatePath: cohortRef.path.toString(),
            program: programId,
            cohortKey: cohort.firebaseKey
          });
          updateDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      updateDef.reject(error);
    });

    return updateDef.promise();
  },

  getCohortOrder: function() {
    var orderDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var cohortOrderRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('cohortOrder');
      cohortOrderRef.once(
        'value',
        function(cohortOrder) {
          cohortOrder = rs.api.util.stripSentinelArray(cohortOrder.val());
          orderDef.resolve(cohortOrder);
        },
        function(error) {
          rs.analytics.trackApiError("getCohortOrder", "Could not get the cohort order.", error, {
            firebaseSimulatePath: cohortOrderRef.path.toString(),
            program: programId
          });
          orderDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      orderDef.reject(error);
    });

    return orderDef.promise();
  },

  deleteCohort: function(cohort) {
    var deleteDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      // TODO: Delete first, then change order.  It is currently the opposite
      //       b/c if you delete a cohort but don't remove it from the order list,
      //       the UI breaks.  The gets function should check for this.
      rs.api.getCohortOrder().done(function(cohortOrder) {
        var newOrder = [];
        for (var i = 0; i < cohortOrder.length; i++) {
          var cohortKey = cohortOrder[i];
          if (cohort.firebaseKey !== cohortKey) {
            newOrder.push(cohortKey);
          }
        }

        rs.api.setCohortOrderRaw(newOrder).done(function() {
          var cohortRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('cohorts').child(cohort.firebaseKey);

          cohortRef.set(null, function(error) {
            if (error === null) {
              deleteDef.resolve();
            } else {
              rs.analytics.trackApiError("deleteCohort", "Could not delete a cohort.", error, {
                firebaseSimulateData: cohort,
                firebaseSimulatePath: cohortRef.path.toString(),
                program: programId,
                cohortKey: cohort.firebaseKey
              });
              deleteDef.reject(error);
            }
          });
        })
        .fail(function(error) {
          deleteDef.reject(error);
        });
      })
      .fail(function(error) {
        deleteDef.reject(error);
      });
    })
    .fail(function(error) {
      deleteDef.reject(error);
    });

    return deleteDef.promise();
  },

  /* Groups
   * ------------------------------------------------------ */
  getGroupMembersPromise: function(groupId) {
    var groupDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var residentsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('residents');
      residentsRef.orderByChild('group').equalTo(groupId).once(
        'value',
        function (groupMembers) {
          groupDef.resolve(groupMembers.val());
        },
        function (error) {
          rs.analytics.trackApiError("getGroupMembersPromise", "Could not get a group's members.", error, {
            firebaseSimulatePath: residentsRef.path.toString(),
            program: programId,
            groupId: groupId
          });
          groupDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      groupDef.reject(error);
    });

    return groupDef.promise();
  },


  getGroupsPromise: function() {
    var groupsDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var groupsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('groups');
      groupsRef.once(
        'value',
        function (groups) {
          rs.api.getGroupOrder().done(function(groupOrder) {
            groups = groups.val();

            //order them properly and building the data array a la fois
            var orderedGroups = [];
            if (groupOrder !== null) {
              for (var i = 0; i < groupOrder.length; i++) {
                var firebaseKey = groupOrder[i];
                if(groups.hasOwnProperty(firebaseKey) && firebaseKey !== "sentinel") {
                  orderedGroups[i] = groups[firebaseKey];
                  orderedGroups[i].firebaseKey = firebaseKey;
                }
                else {
                  // TODO: logging
                  console.log("so why is it in the ordeR? " + firebaseKey);
                }
              }
            }
            else {
              orderedGroups = rs.api.util.buildDataArray(groups);
            }
            groupsDef.resolve({ groups: orderedGroups, groupOrder : groupOrder});
          })
          .fail(function(error) {
            groupsDef.reject(error);
          });
        },
        function (error) {
          rs.analytics.trackApiError("getGroupsPromise", "Could not get the groups list.", error, {
            firebaseSimulatePath: groupsRef.path.toString(),
            program: programId
          });
          groupsDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      groupsDef.reject(error);
    });

    return groupsDef.promise();
  },

  addGroup: function(group) {
    var addDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var groupsRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('groups');

      var groupData = rs.util.cloneObj(group);
      delete groupData.firebaseKey;

      var addedGroupRef = groupsRef.push(groupData, function(error) {
        if (error === null) {
          var key = addedGroupRef.key();
          addedGroupRef.once(
            'value',
            function(addedGroupSnapshot) {
              var addedGroup = this.util.setFirebaseKey(addedGroupSnapshot.val(), key);

              rs.api.getGroupOrder().done(function(groupOrder) {
                var groupOrder = (groupOrder === null || groupOrder === "") ? [] : groupOrder;
                groupOrder.push(addedGroup.firebaseKey);

                rs.api.setGroupOrderRaw(groupOrder).done(function() {
                  addDef.resolve(addedGroup);
                })
                .fail(function(error) {
                  addDef.reject(error);
                });
              })
              .fail(function(error) {
                addDef.reject(error);
              });
            },

            function(error) {
              rs.analytics.trackApiError("addGroup", "Could not get a group after adding.", error, {
                firebaseSimulateData: groupData,
                firebaseSimulatePath: addedGroupRef.path.toString(),
                program: programId,
                groupKey: key
              });
              addDef.reject(error);
            },
            rs.api // context
          );
        } else {
          rs.analytics.trackApiError("addGroup", "Could not add a group.", error, {
            firebaseSimulateData: groupData
          });
          addDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      addDef.reject(error);
    });

    return addDef.promise();
  },

  // TODO: change setGroupOrder calls to this and rename
  setGroupOrderRaw: function(order) {
    order.unshift("sentinel");
    var setOrderDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var groupOrderRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('groupOrder');

      groupOrderRef.set(order, function(error) {
        if (error === null) {
          setOrderDef.resolve();
        } else {
          rs.analytics.trackApiError("setGroupOrderRaw", "Could not set the group order.", error, {
            firebaseSimulateData: order,
            firebaseSimulatePath: groupOrderRef.path.toString(),
            program: programId
          });
          setOrderDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      setOrderDef.reject(error);
    });

    return setOrderDef.promise();
  },

  setGroupOrder: function(order) {
    // TODO: Variable named order is confusing- it appears to be an array of
    //       groups, but the name indicates just the order directly.
    var orderKeys = ['sentinel'];
    for(var i=0; i < order.length; i++) {
      orderKeys.push(order[i].firebaseKey);
    }
    var setOrderDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function(programId) {
      var groupOrderRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('groupOrder');

      groupOrderRef.set(orderKeys, function(error) {
        if (error === null) {
          setOrderDef.resolve();
        } else {
          rs.analytics.trackApiError("setGroupOrder", "Could not set the group order.", error, {
            firebaseSimulateData: orderKeys,
            firebaseSimulatePath: groupOrderRef.path.toString(),
            program: programId
          });
          setOrderDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      setOrderDef.reject(error);
    });

    return setOrderDef.promise();
  },

  updateGroup: function(group) {
    var updateDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var groupRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('groups').child(group.firebaseKey);

      var groupData = rs.util.cloneObj(group);
      delete groupData.firebaseKey;

      groupRef.update(groupData, function(error) {
        if (error === null) {
          updateDef.resolve();
        } else {
          rs.analytics.trackApiError("updateGroup", "Could not update a group.", error, {
            firebaseSimulateData: groupData,
            firebaseSimulatePath: groupRef.path.toString(),
            program: programId,
            groupKey: group.firebaseKey
          });
          updateDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      updateDef.reject(error);
    });

    return updateDef.promise();
  },

  getGroupOrder: function() {
    var orderDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var groupOrderRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('groupOrder');
      groupOrderRef.once(
        'value',
        function(groupOrder) {
          groupOrder = rs.api.util.stripSentinelArray(groupOrder.val());
          orderDef.resolve(groupOrder);
        },
        function(error) {
          rs.analytics.trackApiError("getGroupOrder", "Could not get the group order.", error, {
            firebaseSimulatePath: groupOrderRef.path.toString(),
            program: programId
          });
          orderDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      orderDef.reject(error);
    });

    return orderDef.promise();
  },

  deleteGroup: function(group) {
    var deleteDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      // TODO: Delete first, then change order.  It is currently the opposite
      //       b/c if you delete a group but don't remove it from the order list,
      //       the UI breaks.  The gets function should check for this.
      rs.api.getGroupOrder().done(function(groupOrder) {
        var newOrder = [];
        for (var i = 0; i < groupOrder.length; i++) {
          var groupKey = groupOrder[i];
          if (group.firebaseKey !== groupKey) {
            newOrder.push(groupKey);
          }
        }

        rs.api.setGroupOrderRaw(newOrder).done(function() {
          var groupRef = rs.api.root.child('programs').child(programId).child('currentSchedulingOverview').child('groups').child(group.firebaseKey);

          groupRef.set(null, function(error) {
            if (error === null) {
              deleteDef.resolve();
            } else {
              rs.analytics.trackApiError("deleteGroup", "Could not delete a group.", error, {
                firebaseSimulateData: group,
                firebaseSimulatePath: groupRef.path.toString(),
                program: programId,
                groupKey: group.firebaseKey
              });
              deleteDef.reject(error);
            }
          });
        })
        .fail(function(error) {
          deleteDef.reject(error);
        });
      })
      .fail(function(error) {
        deleteDef.reject(error);
      });
    })
    .fail(function(error) {
      deleteDef.reject(error);
    });

    return deleteDef.promise();
  },

  /* Schedule
   * ------------------------------------------------------ */

  getSchedulePromise: function (scheduleId) {
    var scheduleDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function (programId) {
      var scheduleRef = rs.api.root.child('programs').child(programId).child('schedules').child(scheduleId);

      scheduleRef.once(
        'value',
        function (schedule) {
          scheduleDef.resolve(schedule.val());
        },
        function (error) {
          rs.analytics.trackApiError("getSchedulePromise", "Could not get a schedule.", error, {
            firebaseSimulatePath: scheduleRef.path.toString(),
            program: programId,
            scheduleId: scheduleId
          });
          scheduleDef.reject(error);
        });
    })
    .fail(function(error) {
      scheduleDef.reject(error);
    });

    return scheduleDef.promise();
  },

  getScheduleListPromise: function() {
    var schedulesDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    programIdPromise.done(function(programId) {
      var schedulesRef = rs.api.root.child('programs').child(programId).child('schedules');

      schedulesRef.once(
        'value',
        function(schedules) {
          schedulesDef.resolve(schedules.val());
        },
        function(error) {
          rs.analytics.trackApiError("getScheduleListPromise", "Could not get the schedules list.", error, {
            firebaseSimulatePath: schedulesRef.path.toString(),
            program: programId
          });
          schedulesDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      schedulesDef.reject(error);
    });

    return schedulesDef.promise();
  },

  /* Schedule Overview
   * ------------------------------------------------------ */
  newSchedOverview: function(schedOverview) {
    var addDef = $.Deferred();
    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function (programId) {
      var schedRef = rs.api.root.child('programs').child(programId).child('schedulingOverviews');
      var schedRefId = schedRef.push(schedOverview, function(error) {
        if(error === null) {
          addDef.resolve(schedRefId.key());
        }
        else {
          rs.analytics.trackApiError("newSchedOverview", "Could not create a new schedule overview.", error, {
            firebaseSimulateData: schedOverview,
            firebaseSimulatePath: schedRef.path.toString(),
            program: programId
          });
          addDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      addDef.reject(error);
    });

    return addDef.promise();
  },

  setRequestProcessingPromise: function(schedOverviewId) {
    var requestProcessingDef = $.Deferred();
    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function (programId) {
      var scheduleRequestRef = rs.api.root.child('programs').child(programId).child("requestProcessing");
      scheduleRequestRef.set(schedOverviewId, function(error) {
        if(error === null) {
          rs.analytics.track("Made a Schedule");
          requestProcessingDef.resolve();
        }
        else {
          rs.analytics.trackApiError("setRequestProcessingPromise", "Could not set a request to process a schedule overview.", error, {
            firebaseSimulateData: schedOverviewId,
            firebaseSimulatePath: scheduleRequestRef.path.toString(),
            program: programId
          });
          requestProcessingDef.reject(error);
        }
      });
    })
    .fail(function(error) {
      requestProcessingDef.reject(error);
    });

    return requestProcessingDef.promise();
  },

  getElectivesPromise: function() {
    var electivesDef = $.Deferred();
    var rotationsPromise = rs.api.getRotationsPromise();
    rotationsPromise.done(function (rotations) {
      var electives = [];
      for(var i = 0; i < rotations.length; i++) {
        var rotation = rotations[i];
        if(rotation.isElective) {
          electives.push(rotation);
        }
      }
      electivesDef.resolve(electives);
    })
    .fail(function(error) {
      electivesDef.reject(error);
    });

    return electivesDef.promise();
  },

  setEmailJob: function(emailAndSettings) {
    var emailJobDef = $.Deferred();
    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function (programId) {
      var emailJobRef = rs.api.root.child('jobs/emailResidents');
      var emailJobData = $.extend(emailAndSettings, {programId: programId});
      emailJobRef.push(
        emailJobData,
        function (error) {
          if(error === null) {
            emailJobDef.resolve();
          }
          else {
            rs.analytics.trackApiError("setEmailJob", "Could not set an email job.", error, {
              firebaseSimulateData: emailJobData,
              firebaseSimulatePath: emailJobRef.path.toString(),
              program: programId
            });
            emailJobDef.reject(error);
          }
        });
    })
    .fail(function(error) {
      emailJobDef.reject(error);
    });

    return emailJobDef.promise();
  },

  setSchedulingJob: function() {
    var schedulingJobDef = $.Deferred();
    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function (programId) {
      var schedulingJobRef = rs.api.root.child('jobs/scheduling');
      var schedulingJobData = {programId: programId};
      schedulingJobRef.push(
        schedulingJobData,
        function (error) {
          if(error === null) {
            schedulingJobDef.resolve();
          }
          else {
            rs.analytics.trackApiError("setSchedulingJob", "Could not set an scheduling job.", error, {
              firebaseSimulateData: schedulingJobData,
              firebaseSimulatePath: schedulingJobRef.path.toString(),
              program: programId
            });
            schedulingJobDef.reject(error);
          }
        });
    })
    .fail(function(error) {
      schedulingJobDef.reject(error);
    });

    return schedulingJobDef.promise();
  },

  getCurrSchedOverviewPromise: function() {
    var currOverviewDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();

    programIdPromise.done(function (programId) {
      var currOverviewRef = rs.api.root.child('programs').child(programId).child("currentSchedulingOverview");
      currOverviewRef.once(
        'value',
        function (currOverview) {
          currOverview = currOverview.val();
          currOverview.groups = rs.api.util.stripSentinelObj(currOverview.groups);
          currOverview.residents = rs.api.util.stripSentinelObj(currOverview.residents);
          currOverview.rotations = rs.api.util.stripSentinelObj(currOverview.rotations);
          currOverviewDef.resolve(currOverview);
        },
        function (error) {
          rs.analytics.trackApiError("getCurrSchedOverviewPromise", "Could not get the current schedule overview.", error, {
            firebaseSimulatePath: currOverviewRef.path.toString(),
            program: programId
          });
          currOverviewDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      currOverviewDef.reject(error);
    });

    return currOverviewDef.promise();
  },

  getSchedOverviewPromise: function(schedId) {
    var schedOverviewDef = $.Deferred();

    var programIdPromise = rs.api.getProgramIdPromise();
    var schedulePromise = rs.api.getSchedulePromise(schedId);
    $.when(programIdPromise, schedulePromise).done(function (programId, schedule) {
      var schedOverviewId = schedule.scheduleOverviewRef;
      var schedOverviewRef = rs.api.root.child('programs').child(programId).child("schedulingOverviews").child(schedOverviewId);
      schedOverviewRef.once(
        'value',
        function (schedOverview) {
          schedOverviewDef.resolve(schedOverview.val());
        },
        function (error) {
          rs.analytics.trackApiError("getSchedOverviewPromise", "Could not get a schedule overview.", error, {
            firebaseSimulatePath: schedOverviewRef.path.toString(),
            program: programId
          });
          schedOverviewDef.reject(error);
        }
      );
    })
    .fail(function(error) {
      schedOverviewDef.reject(error);
    });

    return schedOverviewDef.promise();
  },

  /* Utility
   * ------------------------------------------------------ */
  util: {

    // Firebase arrays auto assign a uid key, strip that out to just work
    // directly with the data in a normal js array.
    // save key in data to keep for updates
    buildDataArray: function(dataObject) {
      var key, dataArr = [];
      for(key in dataObject) {
        if(dataObject.hasOwnProperty(key) && key !== "sentinel") {
          var data = dataObject[key];
          dataArr.push(rs.api.util.setFirebaseKey(data, key));
        }
      }
      return dataArr;
    },

    setFirebaseKey: function(data, firebaseKey) {
      data.firebaseKey = firebaseKey;
      return data;
    },

    stripSentinelArray: function(array) {
      var strippedArr = [];
      for(var i = 0; i < array.length; i++) {
        if(array[i] !== "sentinel") {
          strippedArr.push(array[i]);
        }
      }
      return strippedArr;
    },

    stripSentinelObj: function(object) {
      var key, strippedObj = {};
      for(key in object) {
        if(object.hasOwnProperty(key) && key !== "sentinel") {
          strippedObj[key] = object[key];
        }
      }
      return strippedObj;
    }
  }
};
