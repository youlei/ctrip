(function () {


    if (!jQuery) {
        throw ("dependent on up jquery1.7XX");
        return;
    }
    if (!jQuery.widget) {
        throw ("dependent on jquery-ui");
        return;
    }
    if (!$LAB) {
        throw ("dependent on lab.js");
    }
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month 
            "d+": this.getDate(), //day 
            "h+": this.getHours(), //hour 
            "m+": this.getMinutes(), //minute 
            "s+": this.getSeconds(), //second 
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
            "S": this.getMilliseconds() //millisecond 
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.jQuery1, (this.getFullYear() + "").substr(4 - RegExp.jQuery1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.jQuery1, RegExp.jQuery1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    var uid = 0;
    jQuery.widget('ui.buniessgrid', {
        version: '1.0',
        $grid: null,
        asc: false,

        options: {
            dataStore: null,
            count: null,
            startTime: null,
            endTime: null,
            pageSize: 20,
            status: null,
            current: 1
        },

        _initHeader: function () {
            
        },

        _order: function (column, asc) {
            var newStore;
            if (asc) {
                newStore = this.options.dataStore.sort(
                    function (a, b) {
                        if (a[column] < b[column]) return -1;
                        if (a[column] > b[column]) return 1;
                        return 0;
                    }
                );
            } else {
                newStore = this.options.dataStore.sort(
                    function (a, b) {
                        if (a[column] > b[column]) return -1;
                        if (a[column] < b[column]) return 1;
                        return 0;
                    }
                );
            }
            this._render();
            return newStore;
        },

        refresh: function () {
            this._render();
        },

        option: function (key, value) {

            this._super(key, value);
            var self = this;
            for (var k in key) {
                if (k === "dataStore") {
                    self._render();
                }
            }

        },

        _initPager: function () {
            var self = this,
                newDate = new Date(),
                now = newDate.getTime();
            $LAB.script({ src: "http://webresource.c-ctrip.com/code/cquery/cQuery_110421.js", charset: "utf-8" }).wait(function () {
                $.mod.load('page', '1.2', function () {
                    var config = {
                        options: {
                            min: 1,
                            max: Math.ceil(self.options.count / self.options.pageSize),
                            step: 5,
                            current: self.options.current,
                            prevText: '&lt',
                            nextText: '&gt',
                            splitText: "...",
                            goto: false,
                            showText: false
                        },
                        methods: {

                        },
                        listeners: {
                            onChange: function (current) {
                                //jQuery(document).mask();
                                self.options.current = current;
                                jQuery.ajax({
                                    url: "../AjaxHandle/RequirementEfficiencyHandler.ashx?_dc="+now+"&requirementOrderId=" + self.options.requirementOrderId + "&pageIndex=" + current + "&staffName=" + self.options.staffName + "&groupCode=" + self.options.groupCode + "&startTime=" + self.options.startTime + "&endTime=" + self.options.endTime,
                                    dataType: "json",
                                    success: function (data) {
                                        //jQuery(document).unmask();
                                        if (data.ErrorMessage) {
                                            alert(data.ErrorMessage);
                                        } else {

                                            self.options.dataStore = data.result;
                                            self._render();

                                        }
                                    }
                                });
                            }
                        },
                        template: {
                            pageList: '<div ${className}>${page}</div>',
                            page: '<a ${className} name=pageNo href="javascript:void(0);">${pageNo}</a>',
                            total: '<span ${className}>${pageInfo}</span>',
                            split: '<span ${className}>${splitText}</span>',
                            goto: '<div class="c_pagevalue">到 <input type="text" class="c_page_num" name="" /> 页<input type="button" class="c_page_submit" value="确定" name="" /></div>',
                            prev: '<a ${className} name=pageNo href="javascript:void(0);">${pageNo}</a>',
                            next: '<a ${className} name=pageNo href="javascript:void(0);">${pageNo}</a>'
                        },

                        classNames: {
                            prev: 'c_up',
                            next: 'c_down',
                            prev_no: 'c_up_nocurrent',
                            next_no: 'c_down_nocurrent',
                            list: 'c_page_list layoutfix',
                            action: 'select',
                            disabled: 'disabled',
                            split: 'c_page_ellipsis',
                            total: 'page_total',
                            current: 'current',
                            pageStyle: ".show_page_box .c_page_list {display:inline}\
                                              .show_page_box {padding:8px;line-height:20px;text-align:left;font-family:Arial;font-size:14px;}\
                                              .show_page_box a {color:#0066CC;background: none repeat scroll 0 0 #FFFFFF;border:1px solid #AAAAAA;height: 23px;margin: 0 1px;overflow: hidden; padding: 0 8px;text-decoration: none;}\
                                              .show_page_box a:hover {text-decoration:none;}\
                                              .show_page_box .current {background: none repeat scroll 0 0 #2277CC;border-color: #1256AA;color: #FFFFFF;cursor: default;text-decoration: none;}\
                                              .show_page_box .c_page_list {display:inline;}"
                        }
                    };

                    var ins = $('#pager').regMod('page', '1.2', config);
                    // ins.set('current',50);
                });
            });
        },

        _processDate: function () {
            var self = this;
            for (var i = 0; i < self.options.dataStore.length; i++) {
                var createDate = eval('new ' + self.options.dataStore[i].CreateDate.replace('/', '', 'g').replace('/', '', 'g')),
                    changeDate = eval('new ' + self.options.dataStore[i].LastChangeDate.replace('/', '', 'g').replace('/', '', 'g'));

                self.options.dataStore[i].CreateDate = createDate.format('yyyy-MM-dd');
                self.options.dataStore[i].LastChangeDate = changeDate.format('yyyy-MM-dd');
            }

        },

        _render: function (isFrist) {

            var self = this,
                html = "<div name=tablewarp><div name=tabgrid><table name='grid' width=100% class='info_linelist_table tfix' border=0 cellpadding=0 cellspacing=0>" +
                         "<tr> <th id=GroupName >需求单号 </th><th id=GroupName >项目编号 </th><th id=RequireHanderRate name=column  style=cursor:pointer>创建时间 </th><th id=RequireCompletedRate name=column style=cursor:pointer>项目状态 </th><th id=RequireSuccessRate style=cursor:pointer>认领时长（分钟） </th><th id=RequireSuccessRate style=cursor:pointer>处理时长（分钟） </th><th id=WaitClaim style=cursor:pointer>客户经理 </th><th id=HandingTotalRequireMent style=cursor:pointer>组别 </th><th id=ReportPriceing style=cursor:pointer>操作原因 </th> </tr>" +
                         "<%for(var i=0;i<buiness.length;i++){%>" +
                         "<tr> <td><a target=_blank href=../ChannelRequirement/RequirementDetails.aspx?rid=<%=buiness[i].RequirementOrderId%> ><%= buiness[i].RequirementOrderId%></a> </td> <td><%= buiness[i].ReId%> </td> <td><%= buiness[i].CreateDate%> </td><td><%= buiness[i].HanderStatus%> </td><td><%if(buiness[i].ClaimDuration===-1){ %> <font>-</font> <%}else{%><%= buiness[i].ClaimDuration%> <%}  %><td><%if(buiness[i].HanderDuration ===-1){ %> <font>-</font> <%}else{%><%= buiness[i].HanderDuration %> <%}  %> </td>   <td><%= buiness[i].ProjectManager%> </td> <td><%= buiness[i].GroupName%> </td><td><%= buiness[i].OpreateReason%> </td></tr>" +
                         "<%}%>" +
            //"<tr> <td>    查询不到相关内容，请重新输入 </td> </tr>" +
                         "</table></div><div id=pager style=margin-top:5px></div></div>",
                self = this;

            self._processDate();
            jQuery("[name='tablewarp']").remove();

            var template = _.template(html),
                dom = template({ buiness: self.options.dataStore });

            if (self.$grid) {
                //jQuery(dom).before(jQuery("#pager"))
                //jQuery(dom).appendTo($("[name='tabgrid']")); 
                //jQuery(dom).appendTo($("[name='tabAnchor']")); 
                jQuery(self.element).prepend(dom);
            } else {
                jQuery(dom).appendTo(self.element);
            }

            if (self.options.count / self.options.pageSize > 1) {
                self._initPager();
            }

            self.$grid = jQuery(dom);
        },

        _create: function () {
            var self = this;
            self._render(true);

        }
    });

})();

