(function () {
    /**
    var cQuery=window.cQuery||{};
    cQuery.jsonpPosCallback=function(){
    var outArray=data.result.split("@");
    for(var i=0;i<outArray.length;i++){
    var innerArray=outArray[i].split("|"),
    hotel;
					
    hotel=new this.Hotel(innerArray[0],innerArray[1]);
    this.virtualHotel[hotel.name]=hotel;
    }  
    };
    cQuery.virtualHotel={};
    cQuery.Hotel=function (id,name,url){
    this.id=id;
    this.name=name;
    this.url=url;
    };
    */
    var virtualHotel = {},
		uid = 0;
    function Hotel(id, name, island) {
        this.id = id;
        this.name = name;
        this.island = island;
    };
    if (!$) {
        throw ("component need jquery up 1.7XX");
    }
    if (!$.widget) {
        throw ("need jquery ui");
    }
    $.widget('ui.mitiselect', {
        version: '1.0',
        id: 'mitiselect',
        addBtn: null,
        showSelect: null,
        autocomplate: null,
        suffeixImg: null,
        result: null,
        $hidden: null,
        options: {
            cityId: 2,
            url: '',
            inland: true, // true 閸ヨ棄鍞撮敍?false 閸ヨ棄顦?
            hiddenName: 'txtHotelDescOld',
            pagesize: 10

        },

        _render: function () {

            var self = this,
				hiddenId = "hidden" + uid,
                marTop =  "0px",
				addHTML = "<a name='addtion' href=javascript:void(0);>添加</a>",
				showHTML = "<div name='addtion'> <div  style='float:left;margin-top:" + marTop + "'>已选择: </div> <input type='hidden' name='" + self.options.hiddenName + "' id='" + hiddenId + "'></div>",
				addDom,
				showDom;
            addDom = $(addHTML).insertAfter($(this)[0].element);
            showDom = $(showHTML).insertAfter(addDom);
            self.addBtn = $(addDom);
            self.showSelect = $(showDom);
            self.$hidden = $("#" + hiddenId);
            //self.addBtn.on('click',self.addSelect);
            self.addBtn.click($.proxy(this._addSelect, self));
            $("img[name='" + self.suffeixImg + "']").live('click', { ref: self }, self._removeSelect);
        },

        _initData: function () {
            var self = this;
            self.result = new Object();
            self.result.length = 0;
            self.suffeixImg = "img" + (uid++);
            self.id += (uid++);

        },

        setup: function (str) {
            var arr = str.split("|"),
                self = this;
            for (var i = 0; i < arr.length; i++) {
                var innerArr = arr[i].split(","),
                    island = innerArr[2] === "F" ? true : false,
                    hotel;
                if (innerArr.length === 3) {
                    hotel = new Hotel(innerArr[0], innerArr[1], island);
                    self.result[innerArr[1]] = hotel;
                    self.result.length++;
                }
                
            }
            self._refreshSelect();
        },

        _refreshSelect: function () {
            var self = this;

            for (var r in self.result) {
                if (r !== "length") {
                    if (self.result[r].island) {
                        imgURL = "http://hotels.ctrip.com/hotel/" + self.result[r].id + ".html";
                    } else {
                        imgURL = "http://hotels.ctrip.com/international/" + self.result[r].id + ".html";
                    }
                    imgHTML = "<div style='float:left;margin-right:5px;'><a target=_blank href=" + imgURL + ">" + self.result[r].name + "</a>&nbsp<img src='../Content/JavaScript/images/xx.png' name='" + self.suffeixImg + "'></div>"
                    $(self.showSelect).append(imgHTML);
                }
            }

            self._processHidden();
            self.result.length++;
        },

        _create: function () {
            var self = this;
            self._initData();
            self._render();
            self.element.attr("id", "el" + uid);
            self.autocomplate = $(self.element).autocomplete({
                source: function (request, response) {
                    var resUrl = 'http://hotels.ctrip.com/Domestic/Tool/AjaxFindKeyword.aspx?failedCallback=cQuery.jsonpPosFailedCallback&query=cityId:' + self.options.cityId + ' AND (fullname:"' + $(self.element).val() + '"^2 OR keyword:"' + $(self.element).val() + '") AND sourceType:DomesticHotel &return=pinyin,word,ID,type&section=1-' + self.options.pagesize + '&noTotal=true&responseFormat=json&needTokens=true&resultFormat=text&lineSep=@&fieldSep=|&charset=gb2312';
                    $.ajax({
                        url: encodeURI(resUrl),
                        dataType: "jsonp",
                        success: function (data) {
                            try {
                                response(self._processCallbackData(data));
                            } catch (ex) {
                                throw (ex);
                            }

                        }
                    });
                }
            });
            $(self.autocomplate).focusin(function () {
                $(this).val("");
            });


        },

        _processCallbackData: function (data) {
            var outArray = data.result.split("@"),
				resultArray = [],
                self = this;

            for (var i = 0; i < outArray.length; i++) {
                var innerArray = outArray[i].split("|"),
					hotel;
                //"GHIHotel" Hotel 
                if (innerArray[3] === "GHIHotel" || innerArray[3] === "Hotel") {
                    hotel = new Hotel(innerArray[2], innerArray[1]);
                    virtualHotel[hotel.name] = hotel;
                    resultArray.push(innerArray[1]);
                }

            }

            return resultArray;
        },

        _addSelect: function () {
            var self = this,
				imgURL,
				imgHTML;

            if (virtualHotel[self.autocomplate.val()]) {
                if (!self.result[self.autocomplate.val()]) {
                    if (self.options.island) {
                        imgURL = "http://hotels.ctrip.com/hotel/" + virtualHotel[self.autocomplate.val()].id + ".html";
                    } else {
                        imgURL = "http://hotels.ctrip.com/international/" + virtualHotel[self.autocomplate.val()].id + ".html";
                    }
                    self.result[self.autocomplate.val()] = virtualHotel[self.autocomplate.val()];
                    imgHTML = "<div style='float:left;margin-right:5px;'><a target=_blank href=" + imgURL + ">" + self.autocomplate.val() + "</a>&nbsp<img src='css/image/xx.png' name='" + self.suffeixImg + "'></div>"
                    $(self.showSelect).append(imgHTML);
                    self._processHidden();
                    self.result.length++;
                } else {
                    alert('相同酒詀只能选译一次，请重新填写！');
                }


            } else {
                alert('没有您选译的酒詀，请重新填写！');
            }
        },

        _processHidden: function () {
            var self = this,
			    strHidden = "";
            for (var o in self.result) {
                if (o !== "length") {
                    strHidden += self.result[o].id;
                    strHidden += ","
                    strHidden += o;
                    strHidden += ",";
                    if (self.options.island) {
                        strHidden += "T";
                    } else {
                        strHidden += "F";
                    }
                    strHidden += "|"

                }
            }
            self.$hidden.val(strHidden);
            return strHidden;
        },

        _removeSelect: function (e) {
            var key = $.trim($(e.currentTarget).parent().text());
            delete e.data.ref.result[key];
            $(e.currentTarget).parent().remove();
            e.data.ref._processHidden();
            e.data.ref.result.length--;
        },

        _destroy: function () {
            this.autocomplate.autocomplate("destroy");

        },

        getResult: function () {
            return this.result;
        }
    });

})();


function getCityIdByName() {

    var CityName = "上海,";

    $.ajax({

        type: "POST",
        url: "Hander/GetCityByName.ashx",
        data: { "CityName": CityName },

        success: function (msg) {


            alert(msg);


        },
        error: function (msg) {

            alert("提交失败!");

        }
    });


}