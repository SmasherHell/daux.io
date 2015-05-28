/**
 * Created by smasherhell on 28/05/15.
 */
+function($){
    var markdown_editor = $("#markdown-editor"),
        markdown_menu = $("#markdown-menu"),
        markdown = $("#markdown-content"),
        save_editor = $(".save_editor"),
        editor = $(".editor"),
        contentNode = editor.prev('.page-content'),
        originalHtml = null;


    $("#editThis").click(function() {
        editor.css({"display":"block"});
        originalHtml = contentNode.html();
        markdown_editor.append(contentNode.children());
        demarcate.enable(markdown_editor.get(0), markdown_menu.get(0));
    });

    $(".closeEditor").click(function() {
        editor.css({"display":"none"});
        markdown_editor.empty();
        demarcate.disable();
        contentNode.append(originalHtml);
    });

    save_editor.click(function() {
        var original_text = save_editor.text();
        save_editor.text("Saving...").addClass("disabled");
        console.log(markdown.text());
        $.post(window.location.href, {markdown: markdown.text(), method: 'DauxEdit' }, function() {
            save_editor.text("Done! Reloading page in 5 seconds. You can cancel it with ESC key");
            var timeout = setTimeout(function() {
                location.reload()
            }, 5000); // lie
            $(document).keyup(function(e) {
                if (e.keyCode == 27) { // esc key
                    clearTimeout(timeout);
                    save_editor.text("Page reload cancelled");
                    setTimeout(function() {
                        save_editor.text(original_text).removeClass('disabled');
                    }, 2000);
                }
            });
        }).fail(function() {
            save_editor.removeClass('disabled').addClass("btn-danger").text("Failed :( - try checking your read/write permissions");
            setTimeout(function() {
                save_editor.text(original_text).removeClass('btn-danger');
            },1000);
        });
    });

    $(document).on('demarcateEditorUpdated', function(e, elem) {
        var content = demarcate.parse();
        markdown.text(content);
    });

}(jQuery);