<template>
  <div>
    <a-form :form="form">
      <a-card title="总结信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="24">
            <a-form-item label="成果应用概况">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['extensionDetail.achieveSurvey']"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成果的优点">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['extensionDetail.achieveMerit']"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成果的缺点">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['extensionDetail.achieveDemerit']"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="改进建议">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['extensionDetail.improveProposal']"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-form-item>
        <a-card title="应用照片">
          <p>图片（附件类型jpg，附件大小不超过200KB，不限制个数。）</p>
          <enclosure-uploader
            v-decorator="['extensionDetail.applyPhotos']"
            :max="-1"
            accept=".jpg"
            :maxFileSizeKB="200"
          >
            <template slot="upload">
              <div class="uploader-button">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </template>
            <template slot-scope="{ file, dele }">
              <div v-for="(item, index) in file" :key="index" class="img-file">
                <div class="actions">
                  <a-icon type="delete" @click="dele(item)" />
                </div>
                <img :src="item.response ? uploadBaseDomain + item.response.message : item.file" alt="" />
                <div class="progress">
                  <a-progress
                    :strokeWidth="1"
                    :stroke-color="item.status !== '2' ? '#1890FF' : '#FF4D4F'"
                    :percent="item.progress"
                    :showInfo="false"
                  />
                </div>
              </div>
            </template>
          </enclosure-uploader>

          <!-- <a-upload
          name="avatar"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">上传图片</div>
          </div>
        </a-upload> -->
        </a-card>
      </a-form-item>
      <a-form-item>
        <a-card title="成果推广总结附件">
          <p>附件（附件类型pdf，附件大小不超过3M，不限个数。）</p>
          <enclosure-uploader v-decorator="['extensionDetail.summaryFiles']" :max="-1" :maxFileSize="3" />
        </a-card>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { isEqual, isEmpty } from 'lodash'
import EnclosureUploader from '../../../components/EnclosureUploader/index.vue'
export default {
  components: { EnclosureUploader },
  name: 'SumLogNew',
  props: {
    logNewFormData: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    uploadBaseUrl() {
      return process.env.VUE_APP_UPLOAD_BASE_URL
    },
    uploadBaseDomain() {
      // VUE_APP_UPLOAD_BASE_DOMAIN
      return process.env.VUE_APP_UPLOAD_BASE_DOMAIN
    },
  },
  data() {
    return {
      form: this.$form.createForm(this, {
        onValuesChange: ({ form }) => {
          setTimeout(() => {
            const value = form.getFieldsValue()
            this.$emit('fieldsValueChange', value)
          })
        },
        name: 'coordinated',
      }),
      validatorRules: {},
      loading: false,
      imageUrl: '',
    }
  },
  methods: {
    onChange(e) {
      console.log(e)
    },
    async validateFields() {
      return await this.form.validateFields()
    },
    setFieldsValue(data) {
      this.$nextTick(() => {
        this.form.setFieldsValue(data)
      })
    },
    resetFields() {
      this.form.resetFields()
    },
  },
  watch: {
    logNewFormData: {
      deep: true,
      handler(newVal, old) {
        if (!isEqual(newVal, old) && !isEmpty(old)) {
          this.setFieldsValue(newVal)
        }
      },
    },
  },
}
</script>

<style lang="less" scoped >
/deep/ .ant-card {
  margin-bottom: 10px;
  .ant-card-head {
    background: #fafafa;
  }
}
.uploader-button {
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
.img-file {
  position: relative;
  width: 100px;
  height: 100px;
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  &:hover {
    .actions {
      display: flex;
    }
  }
  .actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #f5f5f5;
    font-size: 18px;
    cursor: pointer;

    align-items: center;
    justify-content: center;
    display: none;
  }
  img {
    width: 100px;
    height: 100px;
  }
  .progress {
    position: absolute;
    width: 100%;
    bottom: -7px;
    left: 0;
  }
}
</style>