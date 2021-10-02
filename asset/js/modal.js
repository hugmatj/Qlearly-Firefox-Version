var editableBookmarkObject = {};
$('body').append(
    `<div class="modal fade" id="edit-bookmark" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <h4 class="modal-title text-center" id="exampleModalLabel">Edit Bookmark
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><img src="asset/image/cross_icon.png" height="20"></button>
                    </h4>
                    <form class="mt-5 px-5" id="edit_entry_form">
                        <div class="form-group mb-4">
                        <input class="form-control lineInput" type="text" placeholder="Entry Title" name="title" id="edit_entry_title">
                        <div class="input_underline"></div>
                        <span class="text-danger"><small id="er_edit_entry_title"></small></span>
                        </div>
                        <div class="form-group mb-4">
                        
                        <input class="form-control lineInput" type="text" placeholder="http://example.com" name="website_url" id="edit_website_url">
                        <div class="input_underline"></div>
                        <span class="text-danger"><small id="er_edit_entry_website_url"></small></span>
                        </div>
                        <div class="form-group mb-4 d-flex">
                        <button class="btn btn-danger mr-auto" id="edit_modal_delete_btn" type="button">
                            Delete
                        </button>
                        
                        <button class="btn btn-success mr-1" data-dismiss="modal"  type="button">
                            Cancel
                        </button>

                        <button class="btn  btn-success" type="submit">
                            Done
                        </button>
                        </div>
                    </form>                
                </div>
            </div>
        </div>
    </div>`
);



$('#edit_entry_form').submit(function(evt) {

    evt.preventDefault();
    var obj = {
        title: $('#edit_entry_title').val(),
        url: $('#edit_website_url').val()
    };

    entry.update(editableBookmarkObject.id, obj);    
    editableBookmarkObject.updationDone(obj);
    $('#edit-bookmark').modal('hide');

});


$('#edit_modal_delete_btn').click(function() {
    editableBookmarkObject.remove();
    $('#edit-bookmark').modal('hide');
});