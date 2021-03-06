function get_google_doc_data(doc_id){
  var doc_url = "https://docs.google.com/spreadsheet/pub?key=" + doc_id + "&output=csv";
  return $.ajax({
      url: doc_url
  });
}

function populate_table(doc_id, table_el, count_el, template, dt_sorting, dt_columns, search_qs){
  $.when(get_google_doc_data(doc_id)).then(
    function(csv){
      var json = $.csv.toObjects(csv);
      var data_count = 0;
      $.each(json, function(i, obj){
          if(obj.title != ""){
            data_count++;
            $("#" + table_el + " tbody").append(Mustache.render(template, obj));
          }
      });

      $('#' + count_el).html(data_count);

      // initialize datatables
      var data_table = $('#' + table_el).dataTable( {
        "aaSorting": dt_sorting,
        "aoColumns": dt_columns,
        "bInfo": false,
        "bPaginate": false
      });

      // allows linking directly to searches
      if ($.address.parameter(search_qs) != undefined) {
        data_table.fnFilter( $.address.parameter(search_qs) );
        $('#' + table_el + '_filter input').ScrollTo();
      }

      // when someone types a search value, it updates the URL
      $('#' + table_el + '_filter input').keyup(function(e){
        $.address.parameter(search_qs, $('#' + table_el + '_filter input').val());
        return false;
      });
    }
  )
}

// populate event data list
var data_template = "\
<tr>\
  <td>{{date}}</td>\
  <td>{{time}}</td>\
  <td>{{event}}</td>\
  <td><a href='{{url}}'>{{location}}</a></td>\
  <td>\
    <p>{{description}}</p>\
    <ul class='list-inline link-list'>\
      <li><a href='{{link_url_1}}'>{{link_name_1}}</a></li>\
      <li><a href='{{link_url_2}}'>{{link_name_2}}</a></li>\
      <li><a href='{{link_url_3}}'>{{link_name_3}}</a></li>\
    </ul>\
  </td>\
</tr>\
";

populate_table("1yrIciDp4TKK7CITjYIHmMxjNkd-ewR9QbI41xzaqJVE", "event-table", "data-count", data_template, [ [1,'asc'] ], [ null, null, null, null, null, null ], 'data-search');

