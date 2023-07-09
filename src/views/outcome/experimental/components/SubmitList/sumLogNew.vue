<template>
  <div>
    <a-form :form="form">
      <a-card title="总结信息">
        <a-row type="flex" justify="space-between" align="top">
          <a-col :span="11">
            <a-form-item label="应用时间">
              <a-range-picker
                v-decorator="['pilotDetail.applicationStartTime', validatorRules.applicationStartTime]"
                style="display: block"
              />
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="参加训练次数">
              <a-input placeholder="0" v-decorator="['pilotDetail.trainAmount', validatorRules.trainAmount]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="参加实战应用次数">
              <a-input
                placeholder="0"
                v-decorator="['pilotDetail.actualAmount', validatorRules.actualAmount]"
              ></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="11">
            <a-form-item label="参加演练次数">
              <a-input placeholder="0" v-decorator="['pilotDetail.drillAmount', validatorRules.drillAmount]"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="实战应用案例或演练案例">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['pilotDetail.actualCase', validatorRules.actualCase]"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成果的优点">
              <a-textarea placeholder="请输入5000字以内的文字" v-decorator="['pilotDetail.achieveMerit']"></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成果的缺点">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['pilotDetail.achieveDemerit']"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="改进建议">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['pilotDetail.improveProposal']"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="与目前匹配的同类产品的比较">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['pilotDetail.productsCompare', validatorRules.productsCompare]"
              ></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="成果提供单位技术服务情况">
              <a-textarea
                placeholder="请输入5000字以内的文字"
                v-decorator="['pilotDetail.serviceSituation']"
              ></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-form-item>
        <a-card title="应用照片">
          <p>图片（附件类型jpg，附件大小不超过200KB，不限制个数。）</p>
          <enclosure-uploader v-decorator="['pilotDetail.applyPhotos']" :max="1" accept=".jpg,.png,.jpeg">
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
                    :stroke-color="item.status != '2' ? '#1890FF' : '#FF4D4F'"
                    :percent="item.progress"
                    :showInfo="false"
                  />
                </div>
              </div>
            </template>
          </enclosure-uploader>
        </a-card>
      </a-form-item>
      <a-form-item>
        <a-card title="试点应用总结附件">
          <p>附件（附件类型pdf，附件大小不超过3M，不限个数。）</p>
          <enclosure-uploader v-decorator="['pilotDetail.summaryFiles']" />
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
      loading: false,
      imageUrl: '',
      validatorRules: {
        applicationStartTime: { rules: [{ required: true, message: '请选择应用时间' }] },
        trainAmount: { rules: [{ required: true, pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入参加训练次数' }] },
        actualAmount: { rules: [{ required: true, pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入参加实战应用次数' }] },
        drillAmount: { rules: [{ required: true, pattern: /^\d+$|^\d+[.]?\d+$/, message: '请输入演练次数' }] },
        actualCase: { rules: [{ required: true, message: '请输入实战应用案例或演练案例' }] },
        productsCompare: { rules: [{ required: true, message: '请输入与目前匹配的同类产品的比较' }] },
      },
    }
  },

  methods: {
    onChange(e) {
      console.log(e)
    },
    async validateFields() {
      return await this.form.validateFields()
    },
    async setFieldsValue(data) {
      this.form.setFieldsValue(data)
    },
    handleChange() {},
    beforeUpload() {},
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

/deep/ .ant-card {
  margin-bottom: 10px;
  .ant-card-head {
    background: #fafafa;
  }
}
</style>