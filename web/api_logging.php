<!DOCTYPE html>
<!---->
<?php
///CONFIGURATION FILE///
require __DIR__ . '/config.php';
///PAGE VARIABLES///START
$PAGE_HEADER = 'API Logging';
$PAGE_SUBHEADER = 'here you can track all users actions';
$PAGE_TITLE = 'TacacsGUI';
$PAGE_SUBTITLE = 'API Logging';
$BREADCRUMB = array(
	'Logging' => [
		'name' => 'API Logging',
		'href' => '',
		'icon' => 'fa fa-search',
		'class' => ''  //last item should have active class!!
	]
);
///!!!!!////
$ACTIVE_MENU_ID=1100;
$ACTIVE_SUBMENU_ID=0;
///!!!!!////
///PAGE VARIABLES///END
?>
<html>

<?php
require __DIR__ . '/templates/header.php';
?>
<!--ADDITIONAL CSS FILES START-->

	<!-- DataTables -->
	<link rel="stylesheet" href="bower_components/datatables.net/css/select.dataTables.min.css">
	<link rel="stylesheet" href="bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
	 <!-- daterange picker -->
	<link rel="stylesheet" href="bower_components/bootstrap-daterangepicker/daterangepicker.css">

<!--ADDITIONAL CSS FILES END-->

<?php

require __DIR__ . '/templates/body_start.php';

?>
<!--MAIN CONTENT START-->

<div class="row">
	<div class="col-xs-12">
		<div class="box box-primary">
			<div class="box-header">
				<h3 class="box-title">API Logging</h3>
			</div><!-- /.box-header -->
			<div class="box-body">
				<div class="table-responsive">
					<div class="row">
						<div class="col-xs-12">
							<div class="dropdown pull-right">
								<a class="btn btn-flat btn-info" onclick="dataTable.settings.filter()">Filter</a>
								<div class="btn-group">
	                <button type="button" class="btn btn-warning btn-flat dropdown-toggle" data-toggle="dropdown">
	                  Action <span class="caret"></span>
	                </button>
	                <ul class="dropdown-menu dropdown-menu-right">
	                  <li><a href="#" onclick="dataTable.settings.exportCsv()">Export (CSV)</a></li>
	                </ul>
	              </div>
								<a class="btn btn-flat btn-warning" href="javascript: void(0)" id="exportLink" style="display: none;" target="_blank"><i class="fa fa-download"></i></a>
								<div class="btn-group">
	                <button type="button" class="btn btn-default btn-flat dropdown-toggle" data-toggle="dropdown">
	                  More Columns <span class="caret"></span>
	                </button>
	                <ul class="dropdown-menu dropdown-menu-right" id="columnsFilter">

	                </ul>
	              </div>
							</div>
						</div>
					</div>
					<div class="datatable-filter" style="display: none;">
					<div class="row">
						<div class="col-xs-12">
							<div class="form-group">
	              <label for="exampleInputEmail1">Table Filter</label>
								<div class="input-group input-group-sm">
	                <input type="text" class="form-control" id="filterRequest" placeholder="Filter attributes...">
	                <span class="input-group-btn">
	                  <button type="button" class="btn btn-flat btn-default" onclick="dataTable.settings.filterErase()"><i class="fa fa-close"></i></button>
	                </span>
	              </div>
								<p class="text-muted">e.g. username=user1</p>
								<button class="btn btn-flat btn-default" id="filterInfo" data-placement="bottom" title="Filter Info"><i class="fa fa-info"></i> Filter Info</button>
								<div class="filterMessage pull-right" style="display: none;"></div>
	            </div>
						</div>
					</div>
					</div>
					<table id="apiLoggingDataTable" class="table-striped display table table-bordered" style="overflow: auto;">

					</table>
				</div>
			</div><!-- /.box-body -->
		</div><!-- /.box -->
	</div><!-- /.col -->
</div><!-- /.row -->

<!--MAIN CONTENT END-->

<?php

require __DIR__ . '/templates/body_end.php';

?>


<?php

require __DIR__ . '/templates/footer_end.php';

?>
<!-- ADDITIONAL JS FILES START-->

	<!-- DataTables -->
	<script src="bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
	<script src="bower_components/datatables.net/js/dataTables.select.min.js"></script>
	<script src="bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
	<!-- date-range-picker -->
	<script src="bower_components/moment/min/moment.min.js"></script>
	<script src="bower_components/bootstrap-daterangepicker/daterangepicker.js"></script>

	<!-- DATATABLES MAIN -->
  <script src="dist/js/tgui_datatables.js"></script>
	<!-- DATATABLES MAIN -->
  <script src="dist/js/pages/api_logging/datatables.js"></script>

<!-- ADDITIONAL JS FILES END-->
</body>
<div class="filter-info-content">
	<div class="box box-solid">
		<div class="box-body">
			<div class="filter-info-part attributes">
				<h4>List of Attributes</h4>
				<p><b>section</b> - Section</p>
				<p><b>username</b> - Username</p>
				<p><b>action</b> - Action</p>
				<p><b>message</b> - Message</p>
			</div>
			<div class="filter-info-part conditions" style="display:none">
				<h4>List of Conditions</h4>
				<p><b>=</b> - implicit equal</p>
				<p><b>!=</b> - implicit not equal</p>
				<p><b>==</b> - equal</p>
				<p><b>!==</b> - not equal</p>
			</div>
		</div>
		<div class="box-footer">
			<button type="button" onclick="$('.filter-info-part').hide(); $('.filter-info-part.attributes').show();">Attributes</button>
			<button type="button" onclick="$('.filter-info-part').hide(); $('.filter-info-part.conditions').show();">Conditions</button>
		</div>
	</div>
</div>
</html>
