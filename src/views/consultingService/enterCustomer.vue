<template>
  <div class="app-container customer-page">
    <el-button size="small" @click="gotoPage" type="primary">返回</el-button>
    <div class="family-info">
      <div class="title">家庭情况</div>
      <el-form :inline="true" :rules="rules" :model="form" class="demo-form-inline">
        <el-form-item label="姓名" prop="linkmanName">
          <el-input v-model="form.linkmanName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="年收入" prop="income">
          <el-input v-model="form.income" placeholder="请输入年收入"></el-input>
        </el-form-item>
        <el-form-item label="预算" prop="budget">
          <el-input v-model="form.budget" placeholder="请输入预算"></el-input>
        </el-form-item>
        <el-form-item label="方案地区" prop="kbaoUserId">
          <el-select v-model="form.kbaoUserId" placeholder="请选择方案地区">
            <el-option
              v-for="item in cities"
              :key="item.id"
              :label="item.areaName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form :model="form">
        <el-form-item label="备注">
          <el-input
            style="width:70%"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"
            v-model="form.remark"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="member-info">
      <div class="title">个人情况</div>
      <div class="header">
        <span class="w0">
          <i>*</i>成员
        </span>
        <span class="w1">
          <i>*</i>选择头像
        </span>
        <span class="w2">
          <i>*</i>性别
        </span>
        <span class="w3">出生日期</span>
        <span class="w4">
          <i>*</i>年龄
        </span>
        <span class="w5">身份证号</span>
        <span class="w6">有无社保</span>
        <span class="w7">健康状况</span>
        <span class="w8">需要保障/额度</span>
      </div>
      <div class="list">
        <div class="list-li" v-for="(pitem,pindex) in list" :key="pindex">
          <span class="list-bd" :class="'w'+index" v-for="(item,index) in pitem" :key="index">
            <el-input v-model="item.value" v-if="item.type==1" placeholder="请输入内容"></el-input>
            <el-select v-model="item.value" v-if="item.type==2" placeholder="请选择">
              <el-option v-for="p in item.options" :key="p.value" :label="p.label" :value="p.value"></el-option>
            </el-select>
            <el-date-picker v-model="item.value" v-if="item.type==3" type="date" placeholder="选择日期"></el-date-picker>
            <el-input
              v-if="item.type==4"
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="item.value"
            ></el-input>
          </span>
        </div>
      </div>
    </div>
    <div class="vision">
      <div class="title">保障愿景</div>
      <div class="list">
        <div class="list-li" v-for="(item,index) in visionList" :key="index">
          <span>
            <i v-if="index<2">*</i>
            {{index+1}}、
          </span>
          <el-input
            class="list-bd"
            type="textarea"
            autosize
            placeholder="请输入内容"
            v-model="item.value"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="expert-info">
      <div class="title mt30">
        <i>*</i>专家分析
      </div>
      <div class="expert-wb">
        <el-input
          style="width:70%"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入专家分析"
          v-model="form.expertOpinion"
        ></el-input>
      </div>
    </div>
    <div class="work">
      <div class="title mt30">工作安排</div>
      <span>选择出方案的日期：</span>
      <span
        @click="showDialogTable('1')"
        class="bd mr30"
      >{{form.needDateDayId?form.needDateDayId:'请选择日期'}}</span>
      <span>助手：</span>
      <span @click="showDialogTable('2')" class="bd">{{form.aideName?form.aideName:'请选择助手'}}</span>
    </div>
    <div class="operation">
      <el-button type="success" @click="createCustomer">提交</el-button>
      <el-button type="info" @click="gotoPage">取消</el-button>
    </div>
    <el-dialog title="选择助手" width="640px" :visible.sync="dialogTableVisible">
      <div class="date">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
        <span
          v-for="(p,index) in date"
          :class="p.dayStatus==4?p.dayId==currentDate?'active':'':'disabled'"
          :key="index"
          @click="getAideworklist(p)"
        >{{p.msg?p.msg:p.day}}</span>
      </div>
      <div class="aide" v-if="aides.length>0">
        <div class="num">
          <span class="tit">助手</span>
          <span
            @click="selectAide(p)"
            :style="{'width':10/aides.length*10+'%'}"
            v-for="(p,index) in aides"
            :key="index"
            :class="p.aideId == currentAide?'active':''"
          >{{p.aideName}}</span>
        </div>
        <div class="singular">
          <span class="tit">单数</span>
          <span
            :style="{'width':10/aides.length*10+'%'}"
            v-for="(p,index) in aides"
            :key="index"
            :class="p.workNumber<=2?'min':p.workNumber>=10?'max':''"
          >{{p.workNumber}}</span>
        </div>
      </div>
      <div class="opt">
        <el-button @click="submit" type="success">提交</el-button>
        <el-button @click="hideDialogTable" type="info">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/index";
import { parseTime } from "@/utils";
export default {
  name: "enterCustomer",
  mixins: [],
  components: {},
  data() {
    return {
      rules: {
        linkmanName: [
          { required: true, message: "请输入姓名", trigger: "blur" }
        ],
        income: [{ required: true, message: "请输入年收入", trigger: "blur" }],
        budget: [{ required: true, message: "请输入预算", trigger: "blur" }],
        kbaoUserId: [
          { required: true, message: "请输入方案地区", trigger: "blur" }
        ]
      },
      pageStatus: "",
      aides: [],
      form: {
        serviceOrderId: "",
        income: "",
        linkmanName: "",
        remark: "",
        kbaoUserId: "",
        areaName: "",
        budget: "",
        willList: [],
        aideId: "",
        aideName: "",
        needDateDayId: "",
        expertOpinion: "",
        customerMsgList: []
      },
      list: [
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ],
        [
          {
            type: 1,
            value: "",
            require: true,
            name: "customerName"
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "avatarType",
            options: [
              {
                label: "少年男",
                value: 5
              },
              {
                label: "少年女",
                value: 6
              },
              {
                label: "青年男",
                value: 3
              },
              {
                label: "青年女",
                value: 4
              },
              {
                label: "老年男",
                value: 1
              },
              {
                label: "老年女",
                value: 2
              }
            ]
          },
          {
            type: 2,
            value: "",
            require: true,
            name: "gender",
            options: [
              {
                label: "未知",
                value: 0
              },
              {
                label: "男",
                value: 1
              },
              {
                label: "女",
                value: 2
              }
            ]
          },
          {
            type: 3,
            value: "",
            name: "birthday"
          },
          {
            type: 1,
            value: "",
            require: true,
            name: "age"
          },
          {
            type: 1,
            value: "",
            name: "idNumber"
          },
          {
            type: 2,
            value: "",
            name: "isSecurity",
            options: [
              {
                label: "有",
                value: 1
              },
              {
                label: "无",
                value: 0
              }
            ]
          },
          {
            type: 1,
            value: "",
            name: "health"
          },
          {
            type: 4,
            value: "",
            name: "limit"
          },
          {
            type: 5,
            value: "",
            name: "code"
          }
        ]
      ],
      visionList: [
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        },
        {
          value: ""
        }
      ],
      dialogTableVisible: false,
      date: [],
      currentDate: "",
      cities: [],
      currentAide: "",
      currentAideName: ""
    };
  },
  created() {
    this.pageStatus = this.$route.query.pageStatus;
    this.form.serviceOrderId = this.$route.query.id;
    this.initData();
    this.getAreaList();
  },
  methods: {
    // 初始化数据
    async initData() {
      let pageStatus = this.pageStatus;
      if (pageStatus == "edit" || pageStatus == "process") {
        let result = await api.getProcessRequire({
          serviceOrderId: this.form.serviceOrderId
        });
        if (result.status == 1) {
          let processInfo = result.data;
          if (processInfo) {
            this.form = processInfo;
            this.pageStatus = "edit";
            let customerMsgList = processInfo.customerMsgList;
            let willList = processInfo.willList;
            for (let i = 0; i < willList.length; i++) {
              this.visionList[i].value = willList[i];
            }
            for (let i = 0; i < customerMsgList.length; i++) {
              for (var p in customerMsgList[i]) {
                for (let j = 0; j < this.list[i].length; j++) {
                  if (this.list[i][j].name == p) {
                    this.list[i][j].value = customerMsgList[i][p];
                  }
                }
              }
            }
          }
        }
      }
    },
    async getAreaList() {
      //获取可售区域
      let areaResult = await api.getAreaList();
      if (areaResult.status == 1 && areaResult.data) {
        this.cities = areaResult.data;
      }
    },
    showDialogTable(type) {
      if (this.pageStatus == "edit" && type == "2") {
        return false;
      }
      this.dialogTableVisible = !this.dialogTableVisible;
      this.getDaysList();
    },
    hideDialogTable() {
      this.dialogTableVisible = false;
      this.currentAide = "";
      this.currentAideName = "";
      this.currentDate = "";
    },
    gotoPage() {
      this.$router.back(-1);
    },
    async getDaysList() {
      let result = await api.getdayslist();
      if (result.status == 1) {
        if (result.data) {
          this.date = result.data;
        }
      }
    },
    async getAideworklist(item) {
      if (item.dayStatus == 4 && item.msg != "今") {
        this.currentDate = item.dayId;
        if (this.pageStatus != "edit") {
          let result = await api.getAideworklist({
            dayId: item.dayId
          });
          if (result.status == 1) {
            if (result.data) {
              this.aides = result.data;
            }
          } else {
            this.$message({
              type: "error",
              message: result.msg,
              center: true
            });
          }
        }
      }
    },
    selectAide(item) {
      this.currentAide = item.aideId;
      this.currentAideName = item.aideName;
    },
    submit() {
      this.dialogTableVisible = false;
      this.form.needDateDayId = this.currentDate;
      this.form.aideId = this.currentAide;
      this.form.aideName = this.currentAideName;
      this.currentAide = "";
      this.currentDate = "";
      this.currentAideName = "";
    },
    async createCustomer() {
      //创建数据
      let form = this.form;
      let list = this.list;
      let customerMsgList = [];
      for (let i = 0; i < list.length; i++) {
        var obj = {
          customerName: "",
          avatarType: "",
          gender: null,
          age: null
        };
        for (let j = 0; j < list[i].length; j++) {
          if (
            list[i][j].name == "birthday" &&
            list[i][j].value != "" &&
            list[i][j].value != null
          ) {
            obj[list[i][j].name] = parseTime(list[i][j].value, "{y}-{m}-{d}");
          } else {
            obj[list[i][j].name] = list[i][j].value;
          }
        }
        if (
          obj.customerName &&
          (obj.avatarType == "" ||
            obj.gender == null ||
            obj.gender == "" ||
            ((obj.age == null || obj.age == "") && obj.age != 0))
        ) {
          this.$message({
            type: "error",
            message: "请输入个人情况里的必填项",
            center: true
          });
          return false;
        }
        if (
          obj.customerName &&
          obj.avatarType &&
          obj.gender != null &&
          obj.age != null
        ) {
          customerMsgList.push(obj);
        }
      }
      form.customerMsgList = customerMsgList;
      let visionList = this.visionList;
      let willList = [];
      for (let i = 0; i < visionList.length; i++) {
        if (visionList[i].value) {
          willList.push(visionList[i].value);
        }
      }
      if (
        form.linkmanName == "" ||
        form.income == "" ||
        form.kbaoUserId == "" ||
        form.budget == "" ||
        form.expertOpinion == ""
      ) {
        this.$message({
          type: "error",
          message: "请输入必填项",
          center: true
        });
        return false;
      }
      if (willList.length < 2) {
        this.$message({
          type: "error",
          message: "保障愿景至少输入两条",
          center: true
        });
        return false;
      }
      form.willList = willList;
      //创建
      let pageStatus = this.pageStatus;
      let result;
      if (pageStatus == "edit") {
        result = await api.editProcessRequire(this.form);
      } else {
        result = await api.createProcessRequire(this.form);
      }
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "提交成功",
          center: true
        });
        this.$router.back(-1);
      } else {
        this.$message({
          type: "error",
          message: "提交失败",
          center: true
        });
      }
    }
  }
};
</script>

<style lang="less">
.customer-page {
  font-size: 14px;
  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 15px auto;
  }
  .mt30 {
    margin-top: 30px;
  }
  .member-info {
    overflow: auto;
    .header {
      border: 1px #ebeef5 solid;
      border-right: none;
      overflow: hidden;
      width: 150%;
      span {
        float: left;
        color: #909399;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-right: 1px #ebeef5 solid;
        font-weight: bold;
        font-size: 14px;
        box-sizing: border-box;
      }
      i {
        color: #f56c6c;
        margin-right: 5px;
      }
    }
    .list {
      width: 150%;
    }
    .list-li {
      overflow: hidden;
    }
    .list-bd {
      float: left;
      width: 10%;
      box-sizing: border-box;
    }
    .w0 {
      width: 11%;
    }
    .w1 {
      width: 8%;
    }
    .w2 {
      width: 5%;
    }
    .w3 {
      width: 10%;
    }
    .w4 {
      width: 5%;
    }
    .w5 {
      width: 15%;
    }
    .w6 {
      width: 7%;
    }
    .w7 {
      width: 18%;
    }
    .w8 {
      width: 21%;
    }
  }
  .vision {
    .list-li {
      margin-bottom: 15px;
      span {
        width: 50px;
        display: inline-block;
        text-align: right;
        i {
          color: #f00;
        }
      }
    }
    .list-bd {
      display: inline-block;
      width: 80%;
    }
  }
  .work {
    .bd {
      border: 1px #dcdfe6 solid;
      padding: 10px 15px;
      margin-left: 30px;
      color: #999;
    }
    .mr30 {
      margin-right: 30px;
    }
  }
  .expert-info {
    i {
      color: #f56c6c;
      margin-right: 5px;
    }
  }
  .operation {
    margin-top: 30px;
    text-align: center;
    button {
      margin-right: 50px;
    }
  }
  .date {
    border: 1px #dcdfe6 solid;
    width: 300px;
    box-sizing: border-box;
    border-right: none;
    border-bottom: none;
    margin: 0 auto;
    overflow: hidden;
    span {
      float: left;
      height: 40px;
      width: 14.285%;
      text-align: center;
      line-height: 40px;
      box-sizing: border-box;
      border-right: 1px #dcdfe6 solid;
      border-bottom: 1px #dcdfe6 solid;
    }
    .disabled {
      color: #ccc;
    }
    .active {
      background-color: #409eff;
      color: #fff;
    }
  }
  .aide {
    width: 500px;
    margin: 30px auto;
    border: 1px #dcdfe6 solid;
    border-right: none;
    border-bottom: none;
    .num,
    .singular {
      height: 40px;
      position: relative;
    }
    .num {
      .tit {
        border-top: 1px #dcdfe6 solid;
        top: -1px;
        height: 41px;
      }
    }
    .active {
      background-color: #409eff;
      color: #fff;
    }
    .min {
      color: #67c23a;
    }
    .max {
      color: #f00;
    }
    .tit {
      position: absolute;
      left: -50px;
      top: 0;
      border-left: 1px #dcdfe6 solid;
    }
    span {
      float: left;
      height: 40px;
      width: 50px;
      text-align: center;
      line-height: 40px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      box-sizing: border-box;
      border-right: 1px #dcdfe6 solid;
      border-bottom: 1px #dcdfe6 solid;
    }
  }
  .opt {
    text-align: center;
    margin-top: 30px;
  }
}
</style>