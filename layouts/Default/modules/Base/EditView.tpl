{*<!-- {[The file is published on the basis of YetiForce Public License that can be found in the following directory: licenses/License.html]} --!>*}
{strip}
	<div class="contentsDiv">
		<form class="form-horizontal recordEditView" id="EditView" name="EditView" method="post" action="index.php" enctype="multipart/form-data">
			<div class="widget_header row">
				<div class="col-sm-12">
					<div class="pull-left">
						{include file=FN::templatePath("BreadCrumbs.tpl",$MODULE_NAME)}
					</div>
					<div class="contentHeader">
						<span class="pull-right">
							<button class="btn btn-success" type="submit"><strong>{FN::translate('BTN_SAVE', $MODULE_NAME)}</strong></button>&nbsp;&nbsp;
							<button class="btn btn-warning" type="reset" onclick="javascript:window.history.back();"><strong>{FN::translate('BTN_CANCEL', $MODULE_NAME)}</strong></button>
						</span>
						<div class="clearfix"></div>
					</div>
				</div>
			</div>
			<input type="hidden" value="DetailView" name="view">
			<input type="hidden" name="module" value="{$MODULE_NAME}">
			<input type="hidden" name="action" value="Save">
			<input type="hidden" name="record" id="recordId" value="{$RECORD->getId()}">
			{foreach item=BLOCK from=$BLOCKS}
				{if isset($FIELDS[$BLOCK['id']])}
					<div class="panel panel-default col-xs-12 paddingLRZero blockContainer">
						<div class="panel-heading">{$BLOCK['name']}</div>
						<div class="col-md-12 paddingLRZero panel-body blockContent">
							{foreach item=FIELD from=$FIELDS[$BLOCK['id']]}
								<div class="editFields col-sm-12 col-md-6 paddingLRZero">
									<div class="col-md-3 fieldLabel paddingLeft5px">
										<label class="muted">
											{if $FIELD->isMandatory() eq true}<span class="redColor">*</span>{/if}
											{$FIELD->get('label')}
										</label>
									</div>
									<div class="fieldValue col-md-9">
										{assign var=FIELD value=$FIELD->set('fieldvalue',$RECORD->get($FIELD->getName()))}
										{include file=FN::templatePath($FIELD->getTemplate(),$MODULE_NAME) FIELD_MODEL=$FIELD}
									</div>
								</div>
							{/foreach}
						</div>
					</div>
				{/if}
			{/foreach}
		</form>
	</div>
{/strip}

