$(document).ready(function () {

    $(".content_tabs").on("focus", "input", function (event) {
      $(this).attr('autocomplete', 'off')
    });

    $('.custom_tab li').click(function (e) {
      tab_selected = $(this).find('a').attr('href');
      switch (tab_selected) {
        case '#CHTab':
          $('.content_tabs').css({
            'display': 'none'
          });
          $(this).attr('tabindex', '0');
          $(this).addClass('ui-state-hover');
          $(this).addClass('ui-tabs-active');
          $(this).addClass('ui-state-active');
          $(this).attr('aria-selected', 'true');
          $(this).attr('aria-expanded', 'true');
          $('#CHTab').attr('aria-hidden', 'false');
          $('#CHTab').css({
            'display': 'block'
          });
          break;
        case '#FPTab':
          $('.content_tabs').css({
            'display': 'none'
          });
          $(this).attr('tabindex', '0');
          $(this).addClass('ui-state-hover');
          $(this).addClass('ui-tabs-active');
          $(this).addClass('ui-state-active');
          $(this).attr('aria-selected', 'true');
          $(this).attr('aria-expanded', 'true');
          $('#FPTab').attr('aria-hidden', 'false');
          $('#FPTab').css({
            'display': 'block'
          });
          break;
        case '#IMMTab':
          $('.content_tabs').css({
            'display': 'none'
          });
          $(this).attr('tabindex', '0');
          $(this).addClass('ui-state-hover');
          $(this).addClass('ui-tabs-active');
          $(this).addClass('ui-state-active');
          $(this).attr('aria-selected', 'true');
          $(this).attr('aria-expanded', 'true');
          $('#IMMTab').attr('aria-hidden', 'false');
          $('#IMMTab').css({
            'display': 'block'
          });
          break;
        case '#MNTab':
          $('.content_tabs').css({
            'display': 'none'
          });
          $(this).attr('tabindex', '0');
          $(this).addClass('ui-state-hover');
          $(this).addClass('ui-tabs-active');
          $(this).addClass('ui-state-active');
          $(this).attr('aria-selected', 'true');
          $(this).attr('aria-expanded', 'true');
          $('#MNTab').attr('aria-hidden', 'false');
          $('#MNTab').css({
            'display': 'block'
          });
          break;
      }
    });
  });



  var tab_swow = new Array();
  var mphdCustomEntryFormObj = new MPHDCustomEntryForm();

  $(document).off('dhis2.de.event.formLoaded').on('dhis2.de.event.formLoaded', function () {
    if ($("#MPHDCustomForm").length > 0) {
      $("#tabs").tabs();
      $("#MPHDCustomForm_Content").hide();
      $("#loaderDiv").show();

      new MPHDTranslation(function () {
        // $("#loaderDiv").hide();
        // $("#MPHDCustomForm_Content").show();

        console.log(" ========= INIT FORM ");
        mphdCustomEntryFormObj.retrieveCatOption(function () {
          mphdCustomEntryFormObj.retrieveSelectedOrgUnitData();
        })

      });
    }

    $(document).off('dhis2.de.event.dataValuesLoaded').on('dhis2.de.event.dataValuesLoaded', function () {
      mphdCustomEntryFormObj.retrieveSelectedOrgUnitData();
    });

    // ============================================================================================================
    // GCACITranslation

    function MPHDTranslation(_exeFunc) {
      var me = this;

      me.exeFunc = _exeFunc;

      me.selectedDataSetIdTag = $("#selectedDataSetId");

      me.optionSetTermId = "vYRqe6FShDo";

      me.loadedDataSetElementList = false;
      me.loadedOptionSetList = false;

      me.DATAELEMENT_KEY = "de_id";
      me.INDICATOR_KEY = "ind_id";
      me.CATOPTION_KEY = "catOpt_id";
      me.OPTION_KEY = "opt_c";


      // ----------------------------------------------------------------------------------------------
      // URLs

      me.PARAM_DATASET_ID = "@me.PARAM_DATASET_ID";
      console.log(me.PARAM_DATASET_ID);
      console.log(me.optionSetTermId);

      // me.QUERY_URL_DATASET = "../api/dataSets/" + me.PARAM_DATASET_ID + ".json?fields=dataSetElements[dataElement[id,displayFormName,displayDescription],categoryCombo[categories[categoryOptions[id,displayName,displayDescription]],optionSet[options[code,displayName]]]]],indicators[id,displayName]";
      me.QUERY_URL_DATASET = "../api/dataSets/" + me.PARAM_DATASET_ID + ".json?fields=dataSetElements[dataElement[id,displayFormName,displayDescription,categoryCombo[categories[categoryOptions[id,displayName,displayDescription]],optionSet[options[code,displayName]]]]],indicators[id,displayName]";
      me.QUERY_URL_TERMS = "../api/optionSets/" + me.optionSetTermId + ".json?fields=options[code,displayName]&paging=false";


      // ----------------------------------------------------------------------------------------------
      // HTML Element


      me.tableTag = $("body");

      // ----------------------------------------------------------------------------------------------
      // Init method

      me.init = function () {
        console.log("INIT translation ... ");
        me.translateDataSetElementList();
        me.translateOptionSetList();
      }

      // ----------------------------------------------------------------------------------------------
      // Supportive methods

      me.translateDataSetElementList = function () {
        var url = encodeURI(me.QUERY_URL_DATASET);
        url = url.replace(me.PARAM_DATASET_ID, me.selectedDataSetIdTag.val());

        me.loadMetadata(url, function (response) {

          // Translate Data elements & Get CatOptions Map
          var catOptionMap = {};
          var dataSetElements = response.dataSetElements;

          for (var i in dataSetElements) {
            var dataElement = dataSetElements[i].dataElement;

            // Translation for FORMNAME of DEs
            var deDivTag = me.tableTag.find("[keyword='" + me.DATAELEMENT_KEY + ":" + dataElement.id + "']");
            deDivTag.html(dataElement.displayFormName);

            // Translation for DESCRIPTION of DEs
            var descriptionDivTag = deDivTag.closest("div").find(".cta_dg");
            if (descriptionDivTag.length > 0 && dataElement.displayDescription != undefined) {
              descriptionDivTag.attr("description", dataElement.displayDescription);
            }

            // Get CatOptions Map
            var categories = dataElement.categoryCombo.categories;
            for (var i in categories) {
              var categoryOptions = categories[i].categoryOptions;
              for (var j in categoryOptions) {
                var categoryOption = categoryOptions[j];
                catOptionMap[categoryOption.id] = categoryOption;
              }
            }

          }

          // Translation categories
          for (var key in catOptionMap) {
            var catOption = catOptionMap[key];

            // For CatOption NAME
            var catOptionDivTag = me.tableTag.find("[keyword='" + me.CATOPTION_KEY + ":" + key + "']");
            catOptionDivTag.html(catOption.displayName);

            // For CatOption Description
            var descriptionDivTag = catOptionDivTag.closest("div").find(".cta_dg");
            if (descriptionDivTag.length > 0 && catOption.displayDescription != undefined) {
              descriptionDivTag.attr("description", catOption.displayDescription);
            }


          }


          // Translate Indicators
          var indicators = response.indicators;
          for (var i in indicators) {
            var indicator = indicators[i];
            // Translation for NAME of Indicator
            var indicatorDivTag = me.tableTag.find("[keyword='" + me.INDICATOR_KEY + ":" + indicator.id + "']");
            indicatorDivTag.html(indicator.displayName);

            // Translation for DESCRIPTION of Indicator
            var descriptionDivTag = indicatorDivTag.closest("div").find(".cta_dg");
            if (descriptionDivTag.length > 0 && indicator.displayDescription != undefined) {
              descriptionDivTag.attr("description", indicator.displayDescription);
            }
          }


          me.loadedDataSetElementList = true;
          me.afterLoadedTranslationData();

        });

      }

      me.translateOptionSetList = function () {
        var url = encodeURI(me.QUERY_URL_TERMS);
        me.loadMetadata(url, function (response) {

          var options = response.options;
          for (var j in options) {
            var option = options[j];
            var value = option.displayName;
            me.tableTag.find("[keyword='" + me.OPTION_KEY + ":" + option.code + "']").html(value);
            me.tableTag.find("[keyword-data='" + me.OPTION_KEY + ":" + option.code + "']").attr("keyword-data", value);
          }

          me.loadedOptionSetList = true;
          me.afterLoadedTranslationData();
        });
      }

      me.afterLoadedTranslationData = function () {
        if (me.loadedDataSetElementList && me.loadedOptionSetList) {

          me.exeFunc();
        }
      }

      me.loadMetadata = function (url, exeFunc) {
        $.ajax({
          type: "GET"
          , url: url
          , contentType: "application/json;charset=utf-8"
          , beforeSend: function (xhr) {
            //me.hideReportTag();
          }
          , success: function (response) {
            exeFunc(response);
          }
        });

      }


      // ----------------------------------------------------------------------------------------------
      // init

      me.init();

    }

  });
  function UIshowElements() {
    var min = Math.min.apply(Math, tab_swow);

    $('.content_tabs').css({
      'display': 'none'
    });


    switch (min) {
      case 1:
        // Child health
        //ui-tabs-active
        $("#CHTab").css({
          'display': 'block'
        });
        $("#tab1").addClass("ui-state-hover ui-tabs-active ui-state-active");
        $("#tab1").attr('tabindex', function (index, attr) {
          return index + 1;
        });
        $("#tab1").attr('aria-selected', 'true').prop('selected', true);
        $("#tab1").attr('aria-selected', 'true').prop('selected', true);
        break;
      case 2:
        // Family planning
        $("#FPTab").css({
          'display': 'block'
        });
        $("#tab2").addClass("ui-state-hover ui-tabs-active ui-state-active");
        $("#tab2").attr('tabindex', function (index, attr) {
          return index + 1;
        });
        $("#tab2").attr('aria-selected', 'true').prop('selected', true);
        $("#tab2").attr('aria-selected', 'true').prop('selected', true);
        break;
      case "3":
        // Immunization
        $("#IMMTab").css({
          'display': 'block'
        });
        $("#tab3").addClass("ui-state-hover ui-tabs-active ui-state-active");
        $("#tab3").attr('tabindex', function (index, attr) {
          return index + 1;
        });
        $("#tab3").attr('aria-selected', 'true').prop('selected', true);
        $("#tab3").attr('aria-selected', 'true').prop('selected', true);
        break;
      case "4":
        // Maternal Health
        $("#MN").css({
          'display': 'block'
        });
        $("#tab4").addClass("ui-state-hover ui-tabs-active ui-state-active");
        $("#tab4").attr('tabindex', function (index, attr) {
          return index + 1;
        });
        $("#tab4").attr('aria-selected', 'true').prop('selected', true);
        $("#tab4").attr('aria-selected', 'true').prop('selected', true);
        break;
    }
    return;
  }

  function MPHDCustomEntryForm() {
    var me = this;

    me.loaderDivTag = $("#loaderDiv");
    me.mphdCustomFormTag = $("#MPHDCustomForm_Content");

    // ------------------------------------------------------------------------------
    // Variables

    me.ID_CATEGORY_SHOW_HIDE_SUB_CONTENT = "vYXG1JPsjlX";

    me.showHideContentCatOptionList = {};

    // ------------------------------------------------------------------------------
    // URLs

    me.PARAM_ORGUNIT_ID = "@PARAM_ORGUNIT_ID";

    me.QUERY_URL_CATEGORY_SHOW_HIDE_SUB_CONTENT = "../api/categories/" + me.ID_CATEGORY_SHOW_HIDE_SUB_CONTENT + ".json?fields=categoryOptions[id,organisationUnits[id,path]]";
    me.QUERY_URL_SELECTED_ORGUNIT = "../api/organisationUnits/" + me.PARAM_ORGUNIT_ID + ".json?fields=id,path";


    // ------------------------------------------------------------------------------

    me.init = function () {
      me.retrieveCatOption(function () {
        me.retrieveSelectedOrgUnitData();
      })
    }


    // ------------------------------------------------------------------------------
    // Retreive data

    me.retrieveCatOption = function (execFunc) {
      $.ajax({
        type: "GET"
        , url: me.QUERY_URL_CATEGORY_SHOW_HIDE_SUB_CONTENT
        , contentType: "application/json;charset=utf-8"
        , beforeSend: function (xhr) {
          me.hideEntryForm();
        }
        , success: function (response) {

          me.showHideContentCatOptionList = response.categoryOptions;
          if (execFunc) execFunc();
        }
      });
    }


    me.retrieveSelectedOrgUnitData = function () {

      var selectedOrgUnitId = dhis2.de.currentOrganisationUnitId;

      if (selectedOrgUnitId != "") {
        me.hideAllCatOptionPart();

        var url = me.QUERY_URL_SELECTED_ORGUNIT;
        url = url.replace(me.PARAM_ORGUNIT_ID, selectedOrgUnitId);

        $.ajax({
          type: "GET"
          , url: url
          , contentType: "application/json;charset=utf-8"
          , beforeSend: function (xhr) {
            me.hideEntryForm();
          }
          , success: function (response) {

            var path = response.path;

            var catOptionList = me.showHideContentCatOptionList;
            for (var i in catOptionList) {
              var catOption = catOptionList[i];
              var catOptOrgUnitList = catOption.organisationUnits;
              var found = me.searchOrgUnitPath(catOptOrgUnitList, path);
              if (found) {
                me.showOneCatOptionPart(catOption.id);
                UIshowElements();
              }
            }


            me.showEntryForm();
          }
        });
      }

    }

    // ------------------------------------------------------------------------------
    // Supportive methods

    me.hideAllCatOptionPart = function () {
      $("[catOption]").hide();
    }

    me.showOneCatOptionPart = function (catOptionId) {

      //tab_swow.includes(2);
      // true

      switch (catOptionId) {
        case "JYaPYuioUJk":
          // Child health
          if (tab_swow.includes(1) == false) {
            tab_swow.push(1);
          }
          break;
        case "ytJ3YtA7PKb":
          // Family planning
          if (tab_swow.includes(2) == false) {
            tab_swow.push(2);
          }
          break;
        case "QQIwMnaLdXN":
          // Immunization
          if (tab_swow.includes(3) == false) {
            tab_swow.push(3);
          }
          break;
        case "HCc7WYbkbtl":
          // Maternal Health
          if (tab_swow.includes(4) == false) {
            tab_swow.push(4);
          }
          break;
      }

      $("[catOption='" + catOptionId + "']").show();

    }


    me.hideEntryForm = function () {
      me.loaderDivTag.show();
      me.mphdCustomFormTag.hide();
    }

    me.showEntryForm = function () {
      me.loaderDivTag.hide();
      me.mphdCustomFormTag.show();
    }

    me.searchOrgUnitPath = function (list, path) {
      let item;

      if (list) {

        for (let i = 0; i < list.length; i++) {
          let listItem = list[i];

          if (path.indexOf(listItem.path) == 0) {
            item = listItem;
            break;
          }
        }
      }

      return item;
    }


    // ------------------------------------------------------------------------------

    me.init();

  }