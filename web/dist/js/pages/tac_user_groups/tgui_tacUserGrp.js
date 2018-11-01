
var tgui_tacUserGrp = {
  formSelector_add: 'form#addGroupForm',
  formSelector_edit: 'form#editGroupForm',
  select_acl_add: '#addGroupForm .select_acl',
  select_acl_edit: '#editGroupForm .select_acl',
  select_service_add: '#addGroupForm .select_service',
  select_service_edit: '#editGroupForm .select_service',
  init: function() {
    var self = this;

    this.csvParser = new tgui_csvParser(this.csv);
    /*cleare forms when modal is hided*/
    $('#addGroup').on('hidden.bs.modal', function(){
    	self.clearForm();
    })
    $('#editGroup').on('hidden.bs.modal', function(){
    	self.clearForm();
    })/*cleare forms*///end

    $('select[data-objtype="password"]').change(function(){
      tgui_supplier.selector({select: this});
    })

    /*Select2 ACL*/
    this.aclSelect2 = new tgui_select2({
      ajaxUrl : API_LINK + "tacacs/acl/list/",
      template: this.selectionTemplate_acl,
      add: this.select_acl_add,
      edit: this.select_acl_edit,
    });

    $(this.select_acl_add).select2(this.aclSelect2.select2Data());
    $(this.select_acl_edit).select2(this.aclSelect2.select2Data());
    /*Select2 ACL*///END
    /*Select2 Service*/
    this.serviceSelect2 = new tgui_select2({
      ajaxUrl : API_LINK+"tacacs/services/list/",
      template: this.selectionTemplate_service,
      add: this.select_service_add,
      edit: this.select_service_edit,
    });
    $(this.select_service_add).select2(this.serviceSelect2.select2Data());
    $(this.select_service_edit).select2(this.serviceSelect2.select2Data());
    /*Select2 Service*///end
    $('#addGroup').on('show.bs.modal', function(){
      self.aclSelect2.preSelection(0, 'add');
      self.serviceSelect2.preSelection(0, 'add');
    })
  },
  add: function() {
    console.log('Adding new group');
    var self = this;
    var formData = tgui_supplier.getFormData(self.formSelector_add);
    formData.acl = ($(this.select_acl_add).select2('data').length) ? $(this.select_acl_add).select2('data')[0].id : 0;
    formData.service = ($(this.select_service_add).select2('data')) ? $(this.select_service_add).select2('data')[0].id : 0;

    var ajaxProps = {
      url: API_LINK+"tacacs/user/group/add/",
      data: formData
    };//ajaxProps END
    ajaxRequest.send(ajaxProps).then(function(resp) {
      if (tgui_supplier.checkResponse(resp.error, self.formSelector_add)){
        return;
      }
      tgui_error.local.show({type:'success', message: "User Group"+ $(self.formSelector_add + ' input[name="name"]').val() +" was added"})
      $("#addGroup").modal("hide");
      tgui_status.changeStatus(resp.changeConfiguration)
      self.clearForm();
      setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;
  },
  getUserGrp: function(id, name){
    var self = this;
    var ajaxProps = {
      url: API_LINK+"tacacs/user/group/edit/",
      type: "GET",
      data: {
        "name": name,
        "id": id,
      }
    };//ajaxProps END
    var el = {}, el_n = {};
    ajaxRequest.send(ajaxProps).then(function(resp) {
      tgui_supplier.fulfillForm(resp.group, self.formSelector_edit);

      tgui_supplier.selector( {select: self.formSelector_edit + ' select[name="enable_flag"]', flag: resp.group.enable_flag } )

      self.aclSelect2.preSelection(resp.group.acl, 'edit');
      self.serviceSelect2.preSelection(resp.group.service, 'edit');

      $(self.formSelector_edit + ' input[name="priv-lvl-preview"]').val( ( parseInt(resp.group['priv-lvl']) > -1) ? resp.group['priv-lvl'] :  "Undefined");

      $(self.formSelector_edit + ' input[name="acl_native"]').val(resp.group.acl);
      $(self.formSelector_edit + ' input[name="service_native"]').val(resp.group.service);

      $('#editGroup').modal('show')
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
  },
  edit: function() {
    console.log('Edit group');
    var self = this;
    var formData = tgui_supplier.getFormData(self.formSelector_edit, true);

    var ajaxProps = {
      url: API_LINK+"tacacs/user/group/edit/",
      type: 'POST',
      data: formData
    };//ajaxProps END
    if ( Object.keys(ajaxProps.data).length <= 1) {
      if (Object.keys(ajaxProps.data)[0] == "id") {
        tgui_error.local.show({type:'warning', message: "Changes did not found"})
        return;
      }
    }

    if ( formData.enable ) {
      formData.enable_flag = $(this.formSelector_edit+' select[name="enable_flag"]').val()
      formData.enable_encrypt = ( $(this.formSelector_edit+' input[name="enable_encrypt"]').prop('checked') ) ? 1 : 0
    }

    ajaxRequest.send(ajaxProps).then(function(resp) {
      if (tgui_supplier.checkResponse(resp.error, self.formSelector_edit)){
        return;
      }
      tgui_error.local.show({type:'success', message: "User Group"+ $(self.formSelector_edit + ' input[name="name"]').val() +" was edited"})
      $("#editGroup").modal("hide");
      tgui_status.changeStatus(resp.changeConfiguration)
      self.clearForm();
      setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;
  },
  delete: function(id, name, flag) {
    id = id || 0;
    flag = (flag !== undefined) ? false : true;
    name = name || 'undefined';
    console.log('Deleting UserGroupID:'+id+' with name '+name)
    if (flag && !confirm("Do you want delete '"+ name +"'?")) return;
    var ajaxProps = {
      url: API_LINK+"tacacs/user/group/delete/",
      data: {
        "name": name,
        "id": id,
      }
    };//ajaxProps END
    ajaxRequest.send(ajaxProps).then(function(resp) {
      if(resp.result != 1) {
        tgui_error.local.show( {type:'error', message: "Oops! Unknown error appeared :("} ); return;
      }
      tgui_error.local.show({type:'success', message: "User "+ name +" was deleted"})
      tgui_status.changeStatus(resp.changeConfiguration)
      setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;
  },
  csv: {
    columnsRequired: ['name'],
    fileInputId: '#csv-file',
    ajaxLink: 'tacacs/user/group/add/',
    ajaxItem: 'user/group',
    outputId: '#csvParserOutput',
    ajaxHandler: function(resp,index){
      var item = 'group';
      if (resp.error && resp.error.status){
        var error_message = '';
        for (v in resp.error.validation){
          if (!(resp.error.validation[v] == null)){
            for (num in resp.error.validation[v]){
              error_message+='<p class="text-danger">'+resp.error.validation[v][num]+'</p>';
            }
            this.csvParserOutput({tag: error_message, response: index});
          }
        }
      }
      if (resp[item] && resp[item].name) {
        this.csvParserOutput({tag: '<p class="text-success">Device <b>'+ resp[item].name + '</b> was added!</p>', response: index});
        tgui_status.changeStatus(resp.changeConfiguration)
      }
      this.csvParserOutput({tag: '<hr>'});
    },
    finalAnswer: function() {
      this.csvParserOutput({message: 'End of CSV file. Reload database.'})
      setTimeout( function () {dataTable.table.ajax.reload()}, 2000 );
    }
  },
  clearForm: function(){
    tgui_supplier.clearForm();
  	$('.nav.nav-tabs a[href="#general_info"]').tab('show');//select first tab
  	$('.nav.nav-tabs a[href="#general_info_edit"]').tab('show');//select first tab
  },
  selectionTemplate_service: function(data) {
    var output='<div class="selectServiceOption">';
      output += '<text>'+data.text+'</text>';
      output += '</div>'
    return output;
  },
  selectionTemplate_acl: function(data) {
    var output='<div class="selectAclOption">';
      output += '<text>'+data.text+'</text>';
      output += '</div>'
    return output;
  }
}
