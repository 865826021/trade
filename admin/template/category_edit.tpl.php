<?php
defined('DT_ADMIN') or exit('Access Denied');
include tpl('header');
show_menu($menus);
?>
<form method="post" action="?" onsubmit="return check();">
<input type="hidden" name="file" value="<?php echo $file;?>"/>
<input type="hidden" name="action" value="<?php echo $action;?>"/>
<input type="hidden" name="mid" value="<?php echo $mid;?>"/>
<input type="hidden" name="catid" value="<?php echo $catid;?>"/>
<div class="tt">分类修改</div>
<table cellpadding="2" cellspacing="1" class="tb">
<tr>
<td class="tl"><span class="f_hid">*</span> 上级分类</td>
<td><?php echo category_select('category[parentid]', '请选择', $parentid, $mid);?><?php tips('如果不选择，则为顶级分类');?></td>
</tr>
<tr>
<td class="tl"><span class="f_red">*</span> 分类名称</td>
<td><input name="category[catname]" type="text" id="catname" size="30" value="<?php echo $catname;?>"/> <?php echo dstyle('category[style]', $style);?> <span id="dcatname" class="f_red"></span></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 分类英文名称</td>
<td><input name="category[catname_en]" type="text" id="catname_en" size="60" value="<?php echo $catname_en;?>" /></td>
</tr>
<tr>
<td class="tl"><span class="f_red">*</span> 分类目录</td>
<td><input name="category[catdir]" type="text" id="catdir" size="20" value="<?php echo $catdir;?>"/><?php tips('限英文、数字、中划线、下划线、斜线，该分类相关的html文件将保存在此目录');?> <span id="dcatdir" class="f_red"></span></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 外部链接</td>
<td><input name="category[external_link]" type="text" size="60" value="<?php echo $external_link;?>"/><?php tips('此处填写后，不可在本分类发布信息，点击分类将链接到此地址。');?></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 分类图片</td>
<td><input name="category[thumb]" id="thumb" type="text" size="60" value="<?php echo $thumb;?>"/>&nbsp;&nbsp;<span onclick="Dthumb(<?php echo $moduleid;?>,0,0, Dd('thumb').value,true);" class="jt">[上传]</span>&nbsp;&nbsp;<span onclick="_preview(Dd('thumb').value);" class="jt">[预览]</span>&nbsp;&nbsp;<span onclick="Dd('thumb').value='';" class="jt">[删除]</span></td>
</tr>
<td class="tl"><span class="f_hid">*</span> 分类字母</td>
<td><input name="category[letter]" type="text" id="letter" size="2" value="<?php echo $letter;?>"/></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 级别</td>
<td><input name="category[level]" type="text" size="2" value="<?php echo $level;?>"/><?php tips('0 - 不在首页显示 1 - 正常显示 2 - 首页和上级分类并列显示');?></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 分类模板</td>
<td><?php echo tpl_select('list', $MODULE[$mid]['module'], 'category[template]', '默认模板', $template);?></td>
</tr>
<tr style="display:<?php echo $mid == 18 ? 'none' : '';?>;">
<td class="tl"><span class="f_hid">*</span> 内容模板</td>
<td><?php echo tpl_select('show', $MODULE[$mid]['module'], 'category[show_template]', '默认模板', $show_template);?></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> Title(SEO标题)</td>
<td><input name="category[seo_title]" type="text" id="seo_title" value="<?php echo $seo_title;?>" size="61"></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> Meta Keywords<br/>&nbsp; (网页关键词)</td>
<td><textarea name="category[seo_keywords]" cols="60" rows="3" id="seo_keywords"><?php echo $seo_keywords;?></textarea></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> Meta Description<br/>&nbsp; (网页描述)</td>
<td><textarea name="category[seo_description]" cols="60" rows="3" id="seo_description"><?php echo $seo_description;?></textarea></td>
</tr>
<tr>
<td class="tl"><span class="f_red">*</span> 是否启用价格</td>
<td>
<input type="radio" name="category[has_price]" value="1"<?php echo $has_price ? ' checked' : '';?>/> 是
<input type="radio" name="category[has_price]" value="0"<?php echo !$has_price ? ' checked' : '';?>/> 否 <?php tips('发布页面是否有价格选项');?>
</td>
</tr>
<tr>
<td class="tl"><span class="f_red">*</span> 是否启用库存</td>
<td>
<input type="radio" name="category[has_amount]" value="1"<?php echo $has_amount ? ' checked' : '';?>/> 是
<input type="radio" name="category[has_amount]" value="0"<?php echo !$has_amount ? ' checked' : '';?>/> 否 <?php tips('发布页面是否有库存选项');?>
</td>
</tr>
<tr>
<td class="tl"><span class="f_red">*</span> 是否启用运费</td>
<td>
<input type="radio" name="category[has_fee_start]" value="1"<?php echo $has_fee_start ? ' checked' : '';?>/> 是
<input type="radio" name="category[has_fee_start]" value="0"<?php echo !$has_fee_start ? ' checked' : '';?>/> 否 <?php tips('发布页面是否有运费选项');?>
</td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 权限设置</td>
<td class="f_blue">如果没有特殊需要，以下选项不需要设置，全选或全不选均代表拥有对应权限</td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 允许浏览分类</td>
<td><?php echo group_checkbox('category[group_list][]', $group_list);?></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 允许浏览分类信息内容</td>
<td><?php echo group_checkbox('category[group_show][]', $group_show);?></td>
</tr>
<tr>
<td class="tl"><span class="f_hid">*</span> 允许发布信息</td>
<td><?php echo group_checkbox('category[group_add][]', $group_add);?></td>
</tr>

</table>


<div class="sbt"><input type="submit" name="submit" value="确 定" class="btn"/>&nbsp;&nbsp;&nbsp;&nbsp;<input type="reset" name="reset" value="重 置" class="btn"/></div>
</form>
<script type="text/javascript">
function ckDir() {
	if(Dd('catdir').value == '') {
		Dtip('请填写分类目录');
		Dd('catdir').focus();
		return false;
	}
	var url = '?file=category&action=ckdir&mid=<?php echo $mid;?>&catdir='+Dd('catdir').value;
	Diframe(url, 0, 0, 1);
}
function check() {
	if(Dd('catname').value == '') {
		Dmsg('请填写分类名称', 'catname');
		return false;
	}
	if(Dd('catdir').value == '') {
		Dmsg('请填写分类目录', 'catdir');
		return false;
	}
	return true;
}
</script>
<script type="text/javascript">Menuon(1);</script>
<?php include tpl('footer');?>