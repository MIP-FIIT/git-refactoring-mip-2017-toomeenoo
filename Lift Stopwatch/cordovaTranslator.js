// Handles onClick, onKeyup...  Attributes to AddEventListener
// Support EXIT shorthand
// Can't be changed or removed!
var Tr = {
    data: {
        taglist: ["button", "input"],
        handles: ["onClick", "onKeyUp"],
        listen: ["click", "keyup"],
    },
    load: function () {
        Tr.data.ac = [];
        var i = 0; //Tags
        while (i < Tr.data.taglist.length) {
            Tr.data.ac[i] = 0;
            var items = document.getElementsByTagName(Tr.data.taglist[i]);
            var x = 0; //Items
            while (x < items.length) {
                var item = items[x];
                var y = 0; //Attributes
                while (y < Tr.data.handles.length) {
                    var attribute = Tr.data.handles[y];
                    var val = item.getAttribute(attribute);
                    if (val !== null) {
                        if (item.id == "")
                            item.setAttribute("id", Tr.data.taglist[i] + Tr.data.ac[i]++);
                        Tr.al(item.id, Tr.data.listen[y], val, attribute);
                    }
                    y++;
                }
                x++;
            };
            i++;
        }
    },
    al: function (id, trigger, action, remove) {
        var element = document.getElementById(id);
        if (action == "EXIT") {
            element.setAttribute(remove, "");
            element.addEventListener(trigger, Tr.exitapp);
        }else{
            var code = action.replace(/this/g, "document.getElementById('" + id + "')");
            //Tr.data.functions[Tr.data.functions.length] = code;
            //element.setAttribute("data-" + trigger + "-trid", (Tr.data.functions.length - 1));
            element.addEventListener(trigger, function () {eval(code)});
            element.setAttribute(remove, "");
            console.log("#"+id+": "+code);
        }
    },
    exitapp: function () {
        navigator.app.exitApp();
    }
}