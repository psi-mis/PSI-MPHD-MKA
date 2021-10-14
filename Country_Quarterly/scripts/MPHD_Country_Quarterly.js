$(document).ready(function () {

  $("body").on("focus", "input", function (event) {
    $(this).attr('autocomplete', 'off')
  });

  $('.custom_tab li').click(function (e) {
    tab_selected = $(this).find('a').attr('href');
    switch (tab_selected) {
      case '#CHTab':
        $('#MN').css({
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
        $('#MN').css({
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
        $('#MN').css({
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
    }
  });
});

$(document).off('dhis2.de.event.formLoaded').on('dhis2.de.event.formLoaded', function () {
  if ($("#MPHDCustomForm").length > 0) {
    $("#tabs").tabs();
    $("#MPHDCustomForm_Content").hide();
    $("#loaderDiv").show();

    new MPHDTranslation(function () {
      $("#loaderDiv").hide();
      $("#MPHDCustomForm_Content").show();
    });
  }

  // ============================================================================================================
  // Translation

  function MPHDTranslation(_exeFunc) {
    var me = this;

    me.exeFunc = _exeFunc;

    me.selectedDataSetIdTag = $("#selectedDataSetId");

    me.optionSetTermId = "BYE2WbgE9gP";

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