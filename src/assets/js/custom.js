(function($) {
    "use strict";
    $.fn.angularFunction = function() {
        
        $('ion-input').attr('autocomplete', 'off');
        $('input').attr('autocomplete', 'off');
        $(document).on('click', '#DropView.open', function(e) {
            $('.custom-drop').removeClass('open');
            $('.drop-list').css("display", "none");
            $(this).removeClass('open');
        });

        $(document).on('click', '.popover-viewport ion-label.contactUsMenu', function(e) {
            $(document).find('.contact_forms').addClass('open');
        });
        $(document).on('click', '.my-custom-class button.contactUsMenu', function(e) {
            $(document).find('.contact_forms').addClass('open');
        });
        
        $(document).on('click', '.custom-drop', function(e) {

            if ($(this).hasClass('open')) {
                $(this).removeClass('open');
                $(this).find('.drop-list').css("display", "none");
                $('#DropView').removeClass('open');
            } else {
                $(this).addClass('open');
                $(this).find('.drop-list').css("display", "block");
                $('#DropView').addClass('open');
            }
        });

        $(document).on('click', '.customview .form-control', function(e) {         
            $(this).parent().prev().toggleClass('open');
            $(this).parent().toggleClass('open');
            $(this).parent().find('input.native-input').addClass('has-focus');
            $(this).parent().find('input.native-input').focus();            
        });

        $(document).on('click', '.outer_overly', function(e) {
            $(this).next().removeClass('open');
            $(this).next().find('input.native-input').removeClass('has-focus');
            $(this).next().find('input.native-input').val('');
            $(this).next().find('#filterInput').val('');
            $(this).removeClass('open');
        });

        $(document).on('focus', '.hideint .focusout_input', function(e) {
            $(this).parent().prev().removeClass('open');
            $(this).parent().removeClass('open');
            $(this).parent().find('input.native-input').removeClass('has-focus');
        });

        setTimeout(function() {
            $(document).on('click', '#prev_scroll', function(e) {
                event.preventDefault();
                $('#tab_navs ion-segment').animate({
                    scrollLeft: "-=95px"
                }, "slow");
                $('.fixTableHead').animate({
                    scrollLeft: "-=95px"
                }, "slow");
            });

            $(document).on('click', '#next_scroll', function(e) {
                event.preventDefault();
                $('#tab_navs ion-segment').animate({
                    scrollLeft: "+=95px"
                }, "slow");
                $('.fixTableHead').animate({
                    scrollLeft: "+=95px"
                }, "slow");
            });

        }, 1500);
        $(document).on('click', '.clickEv', function(e) {
            e.preventDefault();
        });
        $(document).on('click', '#readmore', function(e) {
            e.preventDefault();
            $("#full_des").addClass('open');
            $("#short_des").addClass('close');
        });
        $(document).on('click', '#viewless', function(e) {
            e.preventDefault();
            $("#full_des").removeClass('open');
            $("#short_des").removeClass('close');
        });
        $(document).on('click', '#search_icons', function(e) {
            $('#search_boxs').toggleClass('open');
        });
        $(document).on('click', '#search_icons2', function(e) {
            $('#search_boxs2').toggleClass('open');
        });
        $(document).on('click', '.link', function(e) {
            e.preventDefault();
            window.open(this.text, '_blank');
        });
        $(document).on('click', '#contact_icon', function(e) {
            e.preventDefault();
            $(".contact_forms").toggleClass('open');
        });
        $(document).on('click', '#note_icon', function(e) {
            e.preventDefault();
            $(".contact_note").toggleClass('open');
        });
        $(document).on('click', '#closes', function(e) {
            e.preventDefault();
            $(".contact_forms").toggleClass('open');
        });
        $(document).on('click', '#close', function(e) {
            e.preventDefault();
            $(".contact_note").toggleClass('open');
        });
        $(document).on('click', '.contactUsMenu', function(e) {
            e.preventDefault();
            $(".contact_forms").addClass('open');
        });
        $(document).on('click', '.action-left', function() {
            $("#fileUpload").trigger("click");
        });
    };
})(jQuery);
$(window).angularFunction();
function iframHight() {
    var frame =  document.getElementById("my_iframe");
    let framHeight = (frame.contentWindow.document.body.scrollHeight + 50) + 'px';
    $("#my_iframe").css('height',framHeight)
}
function showHideRow(row) {
    $("#" + row).toggle();
}

function browserUID() {
    var navigator_info = window.navigator;
    var screen_info = window.screen;
    let uid = navigator_info.mimeTypes.length;
    uid += navigator_info.userAgent.replace(/\D+/g, '');
    uid += navigator_info.plugins.length;
    uid += screen_info.height || '';
    uid += screen_info.width || '';
    uid += screen_info.pixelDepth || '';
    return uid;
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}


function getActionsFromMessage(msg) {
    const matcher = new RegExp(`{{(.*?)}}`, 'gm');
    var actions = msg.match(matcher);
    return actions != undefined ? actions : [];
}

function pageToTop() {
    $("#addPage").animate({
        scrollTop: 0
    }, 400);
}

function removeMenu() {
    $('.contact_forms').removeClass("open")
}

function openContect() {
    $(".contact_forms").addClass('open');
}

function uploadFile() {
    $("#fileUpload").trigger("click");
}

function removeSearch() {
    $(".search_boxs").removeClass('open');
    $(".search_boxs2").removeClass('open');
}