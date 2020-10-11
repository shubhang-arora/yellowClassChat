"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupQuery = undefined;

var _group = require("../models/group");

const GroupQuery = {
  groupPagination: _group.GroupTC.getResolver('pagination')
};
exports.GroupQuery = GroupQuery;