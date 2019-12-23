<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <el-form-item label="商品编号" prop="goodsSn">
          <el-input v-model.trim="goods.goodsSn" oninput="if(value.length>15)value=value.slice(0,15)"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model.trim="goods.name" oninput="if(value.length>15)value=value.slice(0,15)"/>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="goods.product_type_id">
            <el-option v-for="item in product_types" :key="item.id" :label="item.text" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="当前价格" prop="price">
          <el-input-number v-model="goods.price" :min="0" :max="10000" placeholder="0.00">
            <template slot="append">元</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="goods.stock" :min="0" placeholder="0"/>
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
            :file-list="fileList"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.gif"
            list-type="picture-card">
            <img v-if="goods.img_url_new" :src="goods.img_url_new" class="avatar">
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
            :file-list="fileDetailList"
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
            :file-list="filePackageList"
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
            :file-list="fileCarouselList1"
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
            :file-list="fileCarouselList2"
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
            :file-list="fileCarouselList3"
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
      <el-button :disabled="updateDisabled" type="primary" @click="handleEdit">更新商品</el-button>
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
import { detailGoods, editGoods, listCatAndBrand } from '@/api/goods'
import { createStorage, uploadPath } from '@/api/storage'
import Editor from '@tinymce/tinymce-vue'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  name: 'GoodsEdit',
  components: { Editor },
  data() {
    return {
      uploadPath,
      uploadPic: [],
      detailPic: [],
      packagePic: [],
      carouselPic: [],
      newKeywordVisible: false,
      newKeyword: '',
      product_types: [],
      goods: { },
      fileList: [],
      fileDetailList: [],
      filePackageList: [],
      fileCarouselList1: [],
      fileCarouselList2: [],
      fileCarouselList3: [],
      specVisiable: false,
      specForm: { specification: '', value: '', picUrl: '' },
      productVisiable: false,
      updateDisabled: false,
      productForm: {
        id: 0,
        price: 0.0,
        number: 0,
        url: ''
      },
      products: [
        { id: 0, price: 0.0, number: 0, url: '' }
      ],
      attributeVisiable: false,
      attributeForm: { attribute: '', value: '' },
      rules: {
        goodsSn: [
          { required: true, message: '商品编号不能为空', trigger: 'blur' }
        ],
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        product_type_id: [{ required: true, message: '所属分类不能为空', trigger: 'blur' }],
        price: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
        stock: [{ required: true, message: '库存不能为空', trigger: 'blur' }]
      },
      editorInit: {
        language: 'zh_CN',
        convert_urls: false,
        plugins: [
          'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
        ],
        toolbar: [
          'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
          'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
        ],
        images_upload_handler: function(blobInfo, success, failure) {
          const formData = new FormData()
          formData.append('file', blobInfo.blob())
          createStorage(formData)
            .then(res => {
              success(res.data.data.url)
            })
            .catch(() => {
              failure('上传失败，请重新上传')
            })
        }
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
      if (this.$route.query.id == null) {
        return
      }

      const goodsId = this.$route.query.id
      detailGoods(goodsId).then(response => {
        this.goods = response.data.data.goods
        this.fileList = [{ name: 'fileList', url: response.data.data.goods.img_url }]
        this.fileDetailList = [{ name: 'fileDetailList', url: response.data.data.goods.detail_url }]
        this.filePackageList = [{ name: 'filePackageList', url: response.data.data.goods.package_url }]
        this.fileCarouselList1 = [{ name: 'fileCarouselList1', url: response.data.data.goods.carousel_url_1 }]
        this.fileCarouselList2 = [{ name: 'fileCarouselList2', url: response.data.data.goods.carousel_url_2 }]
        this.fileCarouselList3 = [{ name: 'fileCarouselList3', url: response.data.data.goods.carousel_url_3 }]
      })

      listCatAndBrand().then(response => {
        this.product_types = response.data.data.product_types
      })
    },
    handleCategoryChange(value) {
      this.goods.categoryId = value[value.length - 1]
    },
    handleCancel: function() {
      this.$router.push({ path: '/goods/list' })
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
    handleEdit: function() {
      this.updateDisabled = true
      const params = this.goods
      setTimeout(() => {
        editGoods(params)
          .then(response => {
            this.updateDisabled = false
            this.$notify.success({
              title: '成功',
              message: '创建成功'
            })
            this.$router.push({ path: '/goods/list' })
          })
          .catch(response => {
            this.updateDisabled = false
            MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
              confirmButtonText: '确定',
              type: 'error'
            })
          })
      }, 500)
    },
    showInput() {
      this.newKeywordVisible = true
      this.$nextTick(_ => {
        this.$refs.newKeywordInput.$refs.input.focus()
      })
    },
    uploadSpecPicUrl: function(response) {
      this.specForm.picUrl = response.data.url
    },
    handleProductShow(row) {
      this.productForm = Object.assign({}, row)
      this.productVisiable = true
    },
    uploadProductUrl: function(response) {
      this.productForm.url = response.data.url
    }
  }
}
</script>
