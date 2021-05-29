// var MDCTabBar = require('@material/tab-bar');
// import {MDCTabBar} from '.material/tab-bar';

const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';
[].map.call(document.querySelectorAll(selector), function (el) {
    return new mdc.ripple.MDCRipple(el);
});
[].map.call(document.querySelectorAll('.mdc-text-field'), function (el) {
    return new mdc.textField.MDCTextField(el);
});
const main_tabBar = mdc.tabBar.MDCTabBar.attachTo(document.querySelector('.main_tabbar'));
const child_tabBar = mdc.tabBar.MDCTabBar.attachTo(document.querySelector('.child_tabbar'));
const snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
snackbar.timeoutMs = 4000;
snackbar.closeOnEscape = true;

$("#uploadImgBtn").prop('disabled', true);
$("#searchbyTagBtn").prop('disabled', true);
$("#searchImgBtn").prop('disabled', true);
$("#viewImgBtn").prop('disabled', true);
$("#updateImgBtn").prop('disabled', true);
$("#deleteImgBtn").prop('disabled', true);


$("#query_div").css("display", "none");
$("#upload_div").css("display", "block");
main_tabBar.listen('MDCTabBar:activated', function (event) {
    // let tab = tabs[event.detail.index];
    // console.log(tab.children[0].children[1].textContent, 'tab activated');
    if (event.detail.index == 0) {
        $("#primaryTxt").text("Select an Image and than click Upload button.")
        $("#query_div").css("display", "none");
        $("#upload_div").css("display", "block");

    }
    else if (event.detail.index == 1) {
        $("#primaryTxt").text("Query Operaions")
        $("#upload_div").css("display", "none");
        $("#query_div").css("display", "block");

    }
});
$("#search_by_image_div").css("display", "none");
$("#update_tags_div").css("display", "none");
$("#delete_image_div").css("display", "none");
$("#view_image_div").css("display", "none");
$("#search_by_tags_div").css("display", "block");
main_tabBar.activateTab(0);
child_tabBar.listen('MDCTabBar:activated', function (event) {
    if (event.detail.index == 0) {
        $("#search_by_image_div").css("display", "none");
        $("#update_tags_div").css("display", "none");
        $("#delete_image_div").css("display", "none");
        $("#view_image_div").css("display", "none");
        $("#search_by_tags_div").css("display", "block");

    } else if (event.detail.index == 1) {
        $("#search_by_tags_div").css("display", "none");
        $("#update_tags_div").css("display", "none");
        $("#delete_image_div").css("display", "none");
        $("#view_image_div").css("display", "none");
        $("#search_by_image_div").css("display", "block");

    } else if (event.detail.index == 2) {
        $("#search_by_tags_div").css("display", "none");
        $("#delete_image_div").css("display", "none");
        $("#search_by_image_div").css("display", "none");
        $("#update_tags_div").css("display", "none");
        $("#view_image_div").css("display", "block");

    } else if (event.detail.index == 3) {
        $("#search_by_tags_div").css("display", "none");
        $("#search_by_image_div").css("display", "none");
        $("#view_image_div").css("display", "none");
        $("#delete_image_div").css("display", "none");
        $("#update_tags_div").css("display", "block");

    } else if (event.detail.index == 4) {
        $("#search_by_tags_div").css("display", "none");
        $("#search_by_image_div").css("display", "none");
        $("#view_image_div").css("display", "none");
        $("#update_tags_div").css("display", "none");
        $("#delete_image_div").css("display", "block");

    }
});
child_tabBar.activateTab(0);

const selectFileBtn = document.getElementById("selectFileBtn");

$("#selectFileBtn").bind("click", selectFileBtnOnClick);
$("#selectFileBtn2").bind("click", selectFile2BtnOnClick);
$("#uploadImgBtn").bind("click", uploadImgBtnOnClick);
$("#selectFile").bind("change", selectFileChanged);
$("#selectFile2").bind("change", selectFile2Changed);
$("#searchbyTagBtn").bind("click", searchbyTagBtnOnClick);
$("#searchImgBtn").bind("click", searchImgBtnOnClick);
$("#updateImgBtn").bind("click", updateImgBtnOnClick);
$("#deleteImgBtn").bind("click", deleteImgBtnOnClick);
$("#viewImgBtn").bind("click", viewImgBtnOnClick);

$("#input_tags_search").bind("input", input_tags_searchOnInputChange);
$("#input_url_view_image").bind("input", input_url_view_imageOnInputChange);
$("#input_url_update").bind("input", input_url_updateOnInputChange);
$("#input_tags_update").bind("input", input_tags_updateOnInputChange);
$("#input_img_delete").bind("input", input_img_deleteOnInputChange);

function selectFileBtnOnClick() {
    $("#selectFile").trigger("click");
}

function selectFile2BtnOnClick() {
    $("#selectFile2").trigger("click");
}

function uploadImgBtnOnClick() {
    $("#uploadImgBtn").prop('disabled', true);
    var image_name = "image_" + new Date().getTime();
    var image_file = $("#selectFile")[0].files[0];
    var content_type = image_file.type;
    console.log(content_type);
    console.log(image_name);
    if (content_type.includes("image/")) {
        var formData = new FormData();
        var put_url = `https://lr00fm7ci7.execute-api.us-east-1.amazonaws.com/api_v1/tasks/image?key=${image_name}.${content_type.substr(6)}`
        console.log(put_url);
        formData.append("file", image_file);
        $.ajax({
            type: 'PUT',
            url: put_url,
            data: formData,
            cache: false,
            contentType: content_type,
            processData: false,
            success: handleResponse,
            error: handleResponse
        });

        function handleResponse(response) {
            console.log(response);
            var message = response.status == 200 ? "Upload Successful." : "Upload failed.";
            snackbar.labelText = message;
            snackbar.open();
            $("#uploadImgBtn").prop('disabled', false);
        }
    } else {
        snackbar.labelText = "Not a valid image.";
        snackbar.open();
    }
}

function selectFileChanged() {
    readURL(this, '#blah');
    $("#uploadImgBtn").prop('disabled', false);

}

function selectFile2Changed() {
    readURL(this, '#blah2');
    $("#searchImgBtn").prop('disabled', false);
}

function searchbyTagBtnOnClick() {
    $("#searchbyTagBtn").prop('disabled', true);
    input_txt = $("#input_tags_search").val().trim();
    if (input_txt != null && input_txt != "") {
        if (input_txt.includes(",")) {
            var input_tags = input_txt.split(",").map(function (value) {
                return value.trim();
            });
        } else {
            input_tags = [input_txt];
        }
    } else if (input_txt == "") {
        input_tags = []
    }
    if (!input_tags.includes(undefined) && !input_tags.includes("")) {
        console.log(input_tags);
        var json_data = {
            "tags": input_tags
        };
        var post_url = `https://lr00fm7ci7.execute-api.us-east-1.amazonaws.com/api_v1/tasks/query`
        $.ajax({
            method: 'POST',
            url: post_url,
            headers: {
                "Content-Type": "application/json"
            },
            // beforeSend: function (xhr) {
            //     // xhr.setRequestHeader("Authorization", "Basic " + btoa(""));
            // },
            data: JSON.stringify(json_data),
            success: handleResponse,
            error: handleResponse
        });

        function handleResponse(response) {
            console.log(response);
            if (response.statusCode == 200) {
                snackbar.labelText = "Search Successful.";
                populateList("#imglist1", response.body.links);
            } else {
                snackbar.labelText = "There is an error.";
            }
            snackbar.open();
            $("#searchbyTagBtn").prop('disabled', false);
        }
    } else {
        snackbar.labelText = "Not a valid tag string.";
        snackbar.open();
    }
}

function searchImgBtnOnClick() {

}

function updateImgBtnOnClick() {
    $("#updateImgBtn").prop('disabled', true);
    input_txt_tags = $("#input_tags_update").val().trim();
    input_txt_url = $("#input_url_update").val().trim();
    if (input_txt_tags != null && input_txt_tags != "") {
        if (input_txt_tags.includes(",")) {
            var input_tags = input_txt_tags.split(",").map(function (value) {
                return value.trim();
            });
        } else {
            input_tags = [input_txt_tags];
        }
    } else if (input_txt_tags == "") {
        input_tags = []
    }

    if (input_txt_url != undefined && input_txt_url != "" && !input_tags.includes(undefined) && !input_tags.includes("")) {
        var json_data = {
            "update": {
                "url": input_txt_url,
                "tags": input_tags
            }
        };
        console.log(json_data);
        var post_url = `https://lr00fm7ci7.execute-api.us-east-1.amazonaws.com/api_v1/tasks/query`
        $.ajax({
            method: 'POST',
            url: post_url,
            headers: {
                "Content-Type": "application/json"
            },
            // beforeSend: function (xhr) {
            //     // xhr.setRequestHeader("Authorization", "Basic " + btoa(""));
            // },
            data: JSON.stringify(json_data),
            success: handleResponse,
            error: handleResponse
        });

        function handleResponse(response) {
            console.log(response);
            if (response.statusCode == 200) {
                snackbar.labelText = "Update Successful.";
                populateList("#imglist1", response.body.links);
            } else {
                snackbar.labelText = response.body.errorMessage;
            }
            snackbar.open();
            $("#updateImgBtn").prop('disabled', false);
        }
    } else {
        snackbar.labelText = "Not a valid string(s).";
        snackbar.open();
    }
}

function deleteImgBtnOnClick() {
    $("#deleteImgBtn").prop('disabled', true);
    input_txt_url = $("#input_img_delete").val().trim();
    var image_name = input_txt_url.replace('/^.*[\\\/]/', '');
    console.log(image_name);
    if (image_name != undefined && image_name != "") {
        var delete_url = `https://lr00fm7ci7.execute-api.us-east-1.amazonaws.com/v1/tasks/image?key=${image_name}`
        $.ajax({
            method: 'DELETE',
            url: delete_url,
            headers: {
                "Content-Type": "application/json"
            },
            // beforeSend: function (xhr) {
            //     // xhr.setRequestHeader("Authorization", "Basic " + btoa(""));
            // },
            success: handleResponse,
            error: handleResponse
        });

        function handleResponse(response) {
            console.log(response);
            if (response.statusCode == 200) {
                snackbar.labelText = "Delete Successful.";
            } else {
                snackbar.labelText = "There is an error.";
            }
            snackbar.open();
            $("#deleteImgBtn").prop('disabled', false);
        }
    } else {
        snackbar.labelText = "Not a valid string.";
        snackbar.open();
    }
}

function viewImgBtnOnClick() {
    $("#viewImgBtn").prop('disabled', true);
    input_txt_url = $("#input_url_view_image").val().trim();
    var image_name = input_txt_url.replace('/^.*[\\\/]/', '');
    var image_type = image_name.split('.').pop();
    console.log(image_type);
    console.log(image_name);
    if (image_name != undefined && image_name != "") {
        var get_url = `https://lr00fm7ci7.execute-api.us-east-1.amazonaws.com/v1/tasks/image?key=${image_name}`
        $.ajax({
            method: 'GET',
            url: get_url,
            headers: {
                "Content-Type": "application/json"
            },
            // beforeSend: function (xhr) {
            //     // xhr.setRequestHeader("Authorization", "Basic " + btoa(""));
            // },
            success: handleResponse,
            error: handleResponse
        });

        function handleResponse(response) {
            console.log(response);
            if (response.statusCode == 200) {
                snackbar.labelText = "Retrive Successful.";
                $('#viewImg').attr("src", `data:image/${image_type};base64,${base64encode(response)}`);
            } else {
                snackbar.labelText = "There is an error.";
            }
            snackbar.open();
            $("#viewImgBtn").prop('disabled', false);
        }

        function base64Encode(str) {
            var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var out = "", i = 0, len = str.length, c1, c2, c3;
            while (i < len) {
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt((c1 & 0x3) << 4);
                    out += "==";
                    break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len) {
                    out += CHARS.charAt(c1 >> 2);
                    out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                    out += CHARS.charAt((c2 & 0xF) << 2);
                    out += "=";
                    break;
                }
                c3 = str.charCodeAt(i++);
                out += CHARS.charAt(c1 >> 2);
                out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                out += CHARS.charAt(c3 & 0x3F);
            }
            return out;
        }
    } else {
        snackbar.labelText = "Not a valid string.";
        snackbar.open();
    }
}

function input_tags_searchOnInputChange() {
    if ($(this).val() != undefined && $(this).val() != null && $(this).val() != "") {
        $("#searchbyTagBtn").prop('disabled', false);
    } else {
        $("#searchbyTagBtn").prop('disabled', true);
    }
}

function input_url_view_imageOnInputChange() {
    if ($(this).val() != undefined && $(this).val() != null && $(this).val() != "") {
        $("#viewImgBtn").prop('disabled', false);

    } else {
        $("#viewImgBtn").prop('disabled', true);

    }
}

function input_url_updateOnInputChange() {
    tags_input_val = $("#input_tags_update").val();
    if ($(this).val() != undefined && $(this).val() != null && $(this).val() != "" &&
        tags_input_val != undefined && tags_input_val != null && tags_input_val != "") {
        $("#updateImgBtn").prop('disabled', false);

    } else {
        $("#updateImgBtn").prop('disabled', true);

    }
}

function input_tags_updateOnInputChange() {
    url_input_val = $("#input_url_update").val();
    if ($(this).val() != undefined && $(this).val() != null && $(this).val() != "" &&
        url_input_val != undefined && url_input_val != null && url_input_val != "") {
        $("#updateImgBtn").prop('disabled', false);

    } else {
        $("#updateImgBtn").prop('disabled', true);

    }
}

function input_img_deleteOnInputChange() {
    if ($(this).val() != undefined && $(this).val() != null && $(this).val() != "") {
        $("#deleteImgBtn").prop('disabled', false);

    } else {
        $("#deleteImgBtn").prop('disabled', true);

    }
}

function readURL(input, imgid) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $(imgid).attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function populateList(list_id, list_items) {
    $(list_id).empty();
    if (list_items != null && list_items.length > 0) {
        list_items.forEach(function (item, index) {
            $(list_id).append(`
            <li class="mdc-list-item list_item">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">${item}</span>
            </li>`);
        });
        $(list_id).css('display', 'block');
    }
}

function generateNewChip(id, text) {
    `<div class="chip">
    ${text}
    <span class="closebtn" onclick="this.parentElement.style.display='none'">&times;</span>
    </div>`
}
