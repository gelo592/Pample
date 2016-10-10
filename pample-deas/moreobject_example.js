/* Resident Page Component - Assignments
 * ========================================================================== */
window.rs.resident.component.assignments = {

  _assignments: null,
  __resident: null,
  __rotationsByKey: null,
  __rotations: null,

  _$parent: null,
  _$pane: null,
  _$noAssignments: null,
  _$assignments: null,
  _$addRotation: null,
  _$addBlock: null,
  _$invalidAddBlockTooSmall: null,
  _$invalidAddBlockTooLarge: null,
  _$invalidAddBlockDuplicate: null,
  _$invalidAddBlockNoPeriod: null,
  _$warningDuplicateRotation: null,
  _$alertClose: null,
  _$add: null,
  _$invalids: null,
  _$helpTrigger: null,
  _$helpTarget: null,
  _$assignmentAny: null,
  _$warningSeeExample: null,

  /* Init
   * ------------------------------------------------------ */
  init: function($parent, rotationsByKey, rotations) {
    this._initVars($parent, rotationsByKey, rotations);
    this._initHooks();
    this._initUI();
  },

  _initVars: function($parent, rotationsByKey, rotations) {
    this.__rotationsByKey = rotationsByKey;
    this.__rotations = rotations;

    this._$parent = $parent;
    this._$pane = this._$parent.find(".resident-assignments-wrapper");
    this._$noAssignments = this._$pane.find(".resident-assignments-none");
    this._$assignments = this._$pane.find(".resident-assignments");
    this._$addRotation = this._$pane.find(".resident-assignments-add-rotation");
    this._$addBlock = this._$pane.find(".resident-assignments-add-block");
    this._$invalidAddBlockTooSmall = this._$pane.find(".resident-assignments-invalid-blockTooSmall");
    this._$invalidAddBlockTooLarge = this._$pane.find(".resident-assignments-invalid-blockTooLarge");
    this._$invalidAddBlockDuplicate = this._$pane.find(".resident-assignments-invalid-duplicateBlock");
    this._$invalidAddBlockNoPeriod = this._$pane.find(".resident-assignments-invalid-noPeriod");
    this._$warningDuplicateRotation = this._$pane.find(".assignments-duplicate-rotation");
    this._$add = this._$pane.find(".resident-assignments-add");
    this._$invalids = this._$pane.find(".alert-invalid");
    this._$helpTrigger = this._$pane.find(".help-trigger");
    this._$helpTarget = this._$pane.find(".help-target");
    this._$assignmentAny = this._$pane.find(".assignment-any");
    this._$warningSeeExample = this._$pane.find("#dupe-assignment-see-example");
  },

  _initHooks: function() {
    this._$add.click($.proxy(this._clickAddAssignment, this));
    this._$assignments.on("click", ".resident-assignments-remove", $.proxy(this._clickRemoveAssignment, this));
    this._$helpTrigger.click($.proxy(this.toggleHelp, this));    this._$warningSeeExample.click($.proxy(this.toggleHelp, this));
    this._$warningSeeExample.click($.proxy(this.toggleHelp, this));
    this._$assignmentAny.click($.proxy(this.toggleAssignmentAny, this));
  },

  _initUI: function() {
    this._$helpTarget.collapse({
      toggle: false
    });
  },

  /* Events
   * ------------------------------------------------------ */
  _clickAddAssignment: function(e) {
    e.preventDefault();
    var toAdd;

    if(this._$assignmentAny.hasClass("active")) {
      toAdd = { rotationKey: this._$addRotation.val() };
    }
    else {
      toAdd = {
        period: parseInt(this._$addBlock.val()),
        rotationKey: this._$addRotation.val()
      };
    }

    this.addAssignment(toAdd);
  },
  _clickRemoveAssignment: function(e) {
    var $assignment = $(e.target).parent();
    var pos = $assignment.index();
    this._assignments.splice(pos, 1);

    this._resetAssignments();
    this._drawAssignments();
  },

  /* Controllers
   * ------------------------------------------------------ */
  setResident: function(resident) {
    this.__resident = resident;

    if (this.__resident.assignments === undefined) {
      this._assignments = [];
    }
    else {
      this._assignments = $.extend(true, [], this.__resident.assignments);
    }

    this._resetAssignments();
    this._drawAssignments();
  },
  getAssignments: function() {
    return this._assignments;
  },
  showInvalidSubmission: function(invalid) {
    this._drawSubmissionInvalid(invalid);
  },
  addAssignment: function(toAdd) {
    var invalid = this._validateAssignment(toAdd);

    if (invalid === null) {
      this._assignments.push(toAdd);

      this._resetAssignments();
      this._drawAssignments();
    }
    else {
      this._resetInvalidMsgs();
      this.showInvalidSubmission(invalid);
    }
  },

  /* UI
   * ------------------------------------------------------ */
  _resetInvalidMsgs: function() {
    this._$invalids.hide();
  },
  _resetAssignments: function() {
    this._$assignments.empty();
    this._$addRotation.empty();
    this._$addBlock.val(null);
    this._resetInvalidMsgs();
  },
  _drawAssignments: function() {
    var rotations = [];
    for (var key in this.__rotationsByKey) {
      if (this.__rotationsByKey.hasOwnProperty(key)) {
        var rotation = this.__rotationsByKey[key];
        rotations.push(rotation);
      }
    }

    rotations = rs.page.util.sortRotations(rotations, {prop:'name', dir:'asc'});
    for (var i = 0; i < rotations.length; i++) {
      var key = rotations[i].firebaseKey;
      this._$addRotation.append('<option value="'+key+'">'+rotations[i].name+'</option>');
    }

    if (this._assignments.length === 0) {
      this._$noAssignments.show();
      this._$assignments.hide();
    }
    else {
      for (var i = 0; i < this._assignments.length; i++) {
        var assignment = this._assignments[i];
        if (this.__rotationsByKey[assignment.rotationKey] !== undefined) {
          var rotation = this.__rotationsByKey[assignment.rotationKey];
          var period = isNaN(assignment.period) ? "Any" : assignment.period;
          this._$assignments.append('<li data-key="'+i+'"><i class="fa-li fa fa-times-circle removable resident-assignments-remove"></i>'+rotation.name+' - '+period+'</li>');
        }
        else {
          this.__resident.assignments.splice(i);
          //TODO warn the user that an assignment has been removed because the rotation is gone
        }
      }

      this._$noAssignments.hide();
      this._$assignments.show();
    }
  },

  _drawSubmissionInvalid: function(invalid) {
    if (invalid.periodTooSmall === true) {
      this._$invalidAddBlockTooSmall.show();
    }

    if (invalid.periodTooLarge === true) {
      this._$invalidAddBlockTooLarge.show();
    }

    if (invalid.duplicatePeriod === true) {
      this._$invalidAddBlockDuplicate.show();
    }

    if (invalid.noPeriod === true) {
      this._$invalidAddBlockNoPeriod.show();
    }
  },

  toggleHelp: function(e) {
    e.preventDefault();
    this._$helpTarget.collapse('toggle');
  },

  toggleAssignmentAny: function(e) {
    var label = e.currentTarget;

    if($(label).hasClass("active")) {
      this._$addBlock.attr("disabled", false);
    }
    else {
      this._$addBlock.attr("disabled", true);
    }
  },

  _showDuplicateWarning: function() {
    this._$warningDuplicateRotation.show();
  },

  /* Util
   * ------------------------------------------------------ */
  _checkDuplicateAssignmentAny: function(assignment) {
    for(var i = 0; i < this._assignments.length; i++) {
      var currentAssignment = this._assignments[i];

      if(currentAssignment.rotationKey === assignment.rotationKey) {
        this._showDuplicateWarning();
      }
    }
  },

  _validateAssignment: function(assignment) {
    if(this._$assignmentAny.hasClass("active")) {
      this._checkDuplicateAssignmentAny(assignment);
      return null; // this works because all validation is for period which we don't have
    }

    var invalid = {
      periodTooSmall: false,
      periodTooLarge: false,
      duplicatePeriod: false,
      noPeriod: false
    };

    if(isNaN(assignment.period)) {
      invalid.noPeriod = true;
    }
    else {
      if (assignment.period < 1) {
        invalid.periodTooSmall = true;
      }
      else if (assignment.period > 100) { // TODO: base on rotation length and # periods
        invalid.periodTooLarge = true;
      }
    }
    for (var i = 0; i < this._assignments.length; i++) {
      var currentAssignment = this._assignments[i];

      if (currentAssignment.period === assignment.period) {
        invalid.duplicatePeriod = true;
        break;
      }
    }

    var isInvalid = false;
    for (var invalidKey in invalid) {
      if (invalid.hasOwnProperty(invalidKey)) {
        isInvalid = isInvalid || invalid[invalidKey];
      }
    }

    if (isInvalid === true) {
      return invalid;
    }
    else {
      return null;
    }
  }
};