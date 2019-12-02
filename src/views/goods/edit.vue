<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>商品介绍</h3>
      <el-form ref="goods" :rules="rules" :model="goods" label-width="150px">
        <el-form-item label="商品编号" prop="goodsSn">
          <el-input v-model="goods.goodsSn"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goods.name"/>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="goods.product_type_id">
            <el-option v-for="item in product_types" :key="item.id" :label="item.text" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="当前价格" prop="price">
          <el-input v-model="goods.price" placeholder="0.00">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品图片">
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
        <el-form-item label="详细图">
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
        <el-form-item label="商品简介">
          <el-input v-model="goods.description"/>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="op-container">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleEdit">更新商品</el-button>
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
      newKeywordVisible: false,
      newKeyword: '',
      product_types: [],
      goods: { },
      fileList: [],
      fileDetailList: [],
      specVisiable: false,
      specForm: { specification: '', value: '', picUrl: '' },
      productVisiable: false,
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
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }]
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
        this.fileList = [{ name: '', url: response.data.data.goods.img_url }]
        this.fileDetailList = [{ name: '', url: response.data.data.goods.detail_url }]
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
    onRemoveUpload() {
    },
    onUploadChange(file) {
      console.log('xxxxxxxxxxx', file)
      this.uploadPic = file
    },
    onDetailRemoveUpload() {
    },
    onDetailUploadChange(file) {
      console.log('xxxxxxxxxxx', file)
      this.detailPic = file
    },
    handleEdit: function() {
      const params = this.goods
      const formData = new FormData()
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key])
      })
      formData.append('uploadPic', this.uploadPic.raw)
      formData.append('detailPic', this.detailPic.raw)
      editGoods(formData)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '创建成功'
          })
          this.$router.push({ path: '/goods/list' })
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
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
