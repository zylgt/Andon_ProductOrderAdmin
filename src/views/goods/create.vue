<template>
  <div class="app-container">

    <el-card v-loading="listLoading" element-loading-text="正在新增中。。。" class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <el-form-item label="商品编号" prop="goodsSn">
          <el-input v-model.trim="goods.goodsSn" oninput="if(value.length>15)value=value.slice(0,15)"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model.trim="goods.name" oninput="if(value.length>15)value=value.slice(0,15)"/>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="goods.product_type">
            <el-option v-for="item in product_types" :key="item.id" :label="item.text" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="当前价格" prop="price">
          <el-input v-model="goods.price" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="goods.stock" placeholder="0"/>
        </el-form-item>
        <el-form-item label="商品头图">
          <el-upload
            :action="uploadPath"
            :show-file-list="true"
            :auto-upload="false"
            :headers="headers"
            :on-remove="onRemoveUpload"
            :on-change="onUploadChange"
            :limit="1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <img v-if="goods.picUrl" :src="goods.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="说明书图">
          <el-upload
            :action="uploadPath"
            :show-file-list="true"
            :auto-upload="false"
            :headers="headers"
            :on-remove="onDetailRemoveUpload"
            :on-change="onDetailUploadChange"
            :limit="1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <img v-if="goods.detail_url_new" :src="goods.detail_url_new" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="包装图">
          <el-upload
            :action="uploadPath"
            :show-file-list="true"
            :auto-upload="false"
            :headers="headers"
            :on-remove="onPackageRemoveUpload"
            :on-change="onPackageUploadChange"
            :limit="1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <img v-if="goods.package_url_new" :src="goods.package_url_new" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图一">
          <el-upload
            :action="uploadPath"
            :show-file-list="true"
            :auto-upload="false"
            :headers="headers"
            :on-remove="onCarouselRemoveUpload1"
            :on-change="onCarouselUploadChange1"
            :limit="1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <img v-if="goods.carousel_url_1_new" :src="goods.carousel_url_1_new" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图二">
          <el-upload
            :action="uploadPath"
            :show-file-list="true"
            :auto-upload="false"
            :headers="headers"
            :on-remove="onCarouselRemoveUpload2"
            :on-change="onCarouselUploadChange2"
            :limit="1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <img v-if="goods.carousel_url_2_new" :src="goods.carousel_url_2_new" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图三">
          <el-upload
            :action="uploadPath"
            :show-file-list="true"
            :auto-upload="false"
            :headers="headers"
            :on-remove="onCarouselRemoveUpload3"
            :on-change="onCarouselUploadChange3"
            :limit="1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <img v-if="goods.carousel_url_3_new" :src="goods.carousel_url_3_new" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="商品简介">
          <el-input v-model="goods.description" type="textarea" oninput="if(value.length>500)value=value.slice(0,500)"/>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handlePublish">上架</el-button>
    </div>

  </div>
</template>

<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

  .avatar-uploader .el-upload {
    width: 145px;
    height: 145px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 145px;
    height: 145px;
    display: block;
  }
</style>

<script>
import { publishGoods, listCatAndBrand } from '@/api/goods'
import { createStorage, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  name: 'GoodsCreate',
  components: { Editor },

  data() {
    return {
      uploadPath,
      uploadPic: [],
      detailPic: [],
      packagePic: [],
      carouselPic: [],
      listLoading: false,
      newKeywordVisible: false,
      newKeyword: '',
      keywords: [],
      product_types: [],
      goods: { picUrl: '' },
      specVisiable: false,
      specForm: { specification: '', value: '', picUrl: '' },
      multipleSpec: false,
      productVisiable: false,
      attributeVisiable: false,
      attributeForm: { attribute: '', value: '' },
      attributes: [],
      rules: {
        goodsSn: [{ required: true, message: '商品编号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
      },
      editorInit: {
        language: 'zh_CN',
        convert_urls: false,
        plugins: ['advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
        toolbar: ['searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample', 'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen']
      }
    }
  },
  computed: {
    headers() {
      return {
        'X-Litemall-Admin-Token': getToken()
      }
    }
  },
  created() {
    this.init()
  },

  methods: {
    init: function() {
      listCatAndBrand().then(response => {
        this.product_types = response.data.data.product_types
      })
    },
    handleCategoryChange(value) {
      this.goods.categoryId = value[value.length - 1]
    },
    handleCancel: function() {
      this.$router.push({ path: '/goods/goods' })
    },
    uploadFileNow(file, name) {
      const formData = new FormData()
      formData.append(name, file)
      createStorage(formData).then(res => {
        console.log('res.data.data.url', res.data.data.url)
        this.goods[name] = res.data.data.url
      }).catch(() => {
        console.log('上传失败，请重新上传')
      })
    },
    onRemoveUpload() {

    },
    onUploadChange(file) {
      this.uploadFileNow(file.raw, 'img_url')
    },
    onDetailRemoveUpload() {

    },
    onDetailUploadChange(file) {
      this.uploadFileNow(file.raw, 'detail_url')
    },
    onPackageRemoveUpload() {

    },
    onPackageUploadChange(file) {
      this.uploadFileNow(file.raw, 'package_url')
    },
    onCarouselRemoveUpload1() {

    },
    onCarouselUploadChange1(file) {
      this.uploadFileNow(file.raw, 'carousel_url_1')
    },
    onCarouselRemoveUpload2() {

    },
    onCarouselUploadChange2(file) {
      this.uploadFileNow(file.raw, 'carousel_url_2')
    },
    onCarouselRemoveUpload3() {

    },
    onCarouselUploadChange3(file) {
      this.uploadFileNow(file.raw, 'carousel_url_3')
    },
    handlePublish: function() {
      this.$refs['goods'].validate(valid => {
        if (valid) {
          this.listLoading = true
          const params = this.goods
          publishGoods(params).then(response => {
            this.listLoading = false
            this.$notify.success({
              title: '成功',
              message: '创建成功'
            })
            this.$router.push({ path: '/goods/list' })
          }).catch(response => {
            this.listLoading = false
            MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
              confirmButtonText: '确定',
              type: 'error'
            })
          })
        }
      })
    },
    handleClose(tag) {
      this.keywords.splice(this.keywords.indexOf(tag), 1)
      this.goods.keywords = this.keywords.toString()
    },
    showInput() {
      this.newKeywordVisible = true
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus()
      })
    }
  }
}
</script>
