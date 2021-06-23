$(document).ready(function () {
    //MPHD_Facility_Monthly
/*
    $('.cta_dg').click(function (e) {
        var title = $(this).parent().text();
        var title_box = title.substring(0, title.length-4)

        console.log('title1: ' + title_box);

        $('.title').html(title_box);
        $('.dialog').css({
            'display': 'inline-block'
        })
    });

    $('.cta').click(function (e) {
        $('.dialog').css({
            'display': 'none'
        })
    });
*/
    ///////////////////////////////////////////

    $('ul.listitems li').click(function (e) {
        tab_selected = $(this).find('a').attr('href');
        switch (tab_selected) {
            case '#Infants':
                break;
            case '#Abortion':
                break;
            case '#Post-abortion':
                break;
            case '#Contraception':
                break;
            case '#Complications':
                break;
        }
    });


});


$(document).off('dhis2.de.event.formLoaded').on('dhis2.de.event.formLoaded', function () {
    if ($("#MPHD_Facility_MonthlyCustomForm").length > 0) {
        $("#tabs").tabs();
        $("#MPHD_Facility_MonthlyCustomForm_Content").hide();
        $("#loaderDiv").show();

        new GCACITranslation(function () {
            $("#loaderDiv").hide();
            $("#MPHD_Facility_MonthlyCustomForm_Content").show();
        });
    }
    
});
