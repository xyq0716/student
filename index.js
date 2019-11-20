var pageSize = 11;
var nowPage = 1;
var tableData = [];

function init() {
    bindEvent();
    $('#menu > dd').eq(0).trigger('click');
}
init();

function bindEvent() {
    //导航栏点击事件
    $('#menu').on('click', 'dd', function (e) {
        $('#menu > dd.active').removeClass('active');
        $(this).addClass('active');
        var id = $(this).attr('data-id');
        if (id == 'student-list') {
            getTableData(nowPage);
            $('#add-student-form')[0].reset();
        }
        $('.content').fadeOut();
        $('#' + id).fadeIn();
    });

    //编辑按钮事件
    $('#edit-submit').on('click', function (e) {
        e.preventDefault();
        //将编辑的信息回填后存储到data中
        var formData = $('#edit-student-form').serialize();
        transferData('/api/student/updateStudent', formData, function () {
            alert('修改成功');
            $('#modal').slideUp(); //弹框淡出
            location.reload();//重新渲染数据
        });
    });

    //新增学生按钮提交事件
    $('#add-submit').on('click', function (e) {
        e.preventDefault();
        //将编辑的信息回填后存储到data中
        var formData = $('#add-student-form').serialize();
        transferData('/api/student/addStudent', formData, function () {
            alert('添加成功');
            $('#add-student-form')[0].reset(); //表单重置，刷新页面
            // location.reload();//重新渲染数据
            $('#menu >dd[data-id=student-list]').trigger('click'); //自动触发第一个表单的点击事件，获取数据
        });
    });

    //搜索按钮事件
    $('#search-submit').click(function () {
        var value = $('#search-word').val();
        if (!value) {
            getTableData(nowPage);
            return false;
        }
        nowPage = 1;
        transferData("/api/student/searchStudent", {
            sex: -1,
            search: value,
            page: nowPage,
            size: pageSize
        }, function (req) {
            console.log(req);
            var allPage = Math.ceil(req.data.cont / pageSize);
            $('#turn-page').turnPage({
                curPage: nowPage,
                allPage: allPage,
                changePage: function (page) {
                    nowPage = page;
                }
            });
            renderTable(req.data.searchList);
        });
    });
}

function getTableData(Page) {
    transferData('/api/student/findByPage', {
        page: Page,
        size: pageSize
    }, function (req) {
        console.log(req);
        allPage = Math.ceil(req.data.cont / pageSize);
        $('#turn-page').turnPage({
            allPage: allPage,
            curPage: Page,
            changePage: function (page) {
                nowPage = page;
                getTableData(nowPage);
            }
        });
        renderTable(req.data.findByPage);
    });
}

function renderTable(data) {
    tableData = data; //将获取到的数据保存到tableData里
    console.log(tableData);
    var str = '';
    data.forEach(function (item, index) {
        str += '<tr>\
        <td> '+ item.sNo + ' </td>\
        <td> '+ item.name + ' </td>\
        <td> '+ (item.sex ? '女' : '男') + ' </td>\
        <td> '+ item.email + ' </td>\
        <td> '+ (new Date().getFullYear() - item.birth) + ' </td>\
        <td> '+ item.phone + ' </td>\
        <td> '+ item.address + ' </td>\
        <td>\
            <button class="btn edit" data-index=' + index + ' >编辑</button>\
            <button class="btn del" data-index=' + index + ' >删除</button>\
        </td>\
    </tr>';
        $('#student-body').html(str);
    })
    bindTableEvent();
}

function bindTableEvent() {
    $('.edit').on('click', function () {
        $('#modal').slideDown();
        var index = $(this).data('index');
        console.log(index);
        initEditForm(tableData[index]);
        console.log(tableData[index]);
    });

    $('.modal-content').click(function (e) {
        e.stopPropagation();
    });

    $('.close').click(function () {
        $('#modal').slideUp();
    });

    $('.del').click(function () {
        var index = $(this).data('index');
        var isDel = window.confirm('确认删除？');
        var sNo = tableData[index].sNo;
        if (isDel) {
            transferData('/api/student/delBySno', {
                sNo: sNo
            }, function (req) {
                alert('删除成功');
                $('#menu >dd[data-id=student-list]').trigger('click');
            });
        }
    });

}

function initEditForm(data) {
    var editForm = $('#edit-student-form')[0];
    for (var prop in data) {
        console.log(editForm[prop]);
        if (editForm[prop]) {
            editForm[prop].value = data[prop];
            // console.log(data[prop]);
        }
    }
}

function transferData(api, data, callback) {
    if ($.type(data) == 'string') {
        data += "&appkey=_XYQ_1547734588028";
    } else {
        data = $.extend(data, {  //合并
            appkey: '_XYQ_1547734588028'
        });
    }
    $.ajax({
        type: 'get',
        url: 'http://api.duyiedu.com' + api,
        data: data,
        dataType: 'json',
        success: function (req) {
            if (req.status == 'success') {
                callback(req);
            } else {
                alert(req.msg);
            }
        }
    });
}