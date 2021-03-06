{*<!-- {[The file is published on the basis of YetiForce Public License that can be found in the following directory: licenses/License.html]} --!>*}
{strip}
	{assign var=LINKS value=$RECORD->getRecordListViewActions()}
	{if count($LINKS) > 0}
		{assign var=ONLY_ONE value=count($LINKS) eq 1}
		<div class="actions">
			<div class="{if !$ONLY_ONE}actionImages hide{/if}">
				{foreach from=$LINKS item=LINK}
					{include file=FN::templatePath("ButtonLink.tpl",$MODULE_NAME) BUTTON_VIEW='listViewBasic'}
				{/foreach}
			</div>
			{if !$ONLY_ONE}
				<button type="button" class="btn btn-sm btn-default toolsAction">
					<span class="glyphicon glyphicon-wrench"></span>
				</button>
			{/if}
		</div>
	{/if}
{/strip}
