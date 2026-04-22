/*
 Navicat Premium Data Transfer

 Source Server         : 面板机
 Source Server Type    : MySQL
 Source Server Version : 80045
 Source Host           : 156.238.229.174:33068
 Source Schema         : zm_api

 Target Server Type    : MySQL
 Target Server Version : 80045
 File Encoding         : 65001

 Date: 22/04/2026 02:06:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for abilities
-- ----------------------------
DROP TABLE IF EXISTS `abilities`;
CREATE TABLE `abilities`  (
  `group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `model` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `channel_id` bigint NOT NULL,
  `enabled` tinyint(1) NULL DEFAULT NULL,
  `priority` bigint NULL DEFAULT 0,
  `weight` bigint UNSIGNED NULL DEFAULT 0,
  `tag` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`group`, `model`, `channel_id`) USING BTREE,
  INDEX `idx_abilities_channel_id`(`channel_id` ASC) USING BTREE,
  INDEX `idx_abilities_priority`(`priority` ASC) USING BTREE,
  INDEX `idx_abilities_weight`(`weight` ASC) USING BTREE,
  INDEX `idx_abilities_tag`(`tag` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of abilities
-- ----------------------------
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-haiku-4-5', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-haiku-4-5-thinking', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-1', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-1-thinking', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-5', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-5-thinking', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6', 13, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6', 15, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6', 16, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6', 25, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6', 26, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6-thinking', 13, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6-thinking', 15, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6-thinking', 25, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-6-thinking', 26, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-opus-4-thinking', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-5', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6', 13, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6', 15, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6', 16, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6', 25, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6', 26, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6-thinking', 13, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6-thinking', 15, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6-thinking', 25, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-6-thinking', 26, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|企业', 'claude-sonnet-4-thinking', 12, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代', 'claude-opus-4-5', 19, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代', 'claude-opus-4-6', 19, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代', 'claude-opus-4-6', 24, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代', 'claude-opus-4-6-thinking', 19, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代', 'claude-opus-4-6-thinking', 24, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代', 'claude-sonnet-4-6', 19, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代', 'claude-sonnet-4-6', 24, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-haiku-4-5', 23, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-haiku-4-5-thinking', 23, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-opus-4-6', 20, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-opus-4-6', 28, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-opus-4-6-thinking', 20, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-sonnet-4', 23, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-sonnet-4-5', 23, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-sonnet-4-5-thinking', 23, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-sonnet-4-6', 20, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|反代|特价', 'claude-sonnet-4-thinking', 23, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|官转', 'claude-opus-4-5', 14, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|官转', 'claude-opus-4-6', 14, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|官转', 'claude-sonnet-4-5', 14, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Claude|官转', 'claude-sonnet-4-6', 14, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Codex|自营', 'gpt-5.2', 1, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Codex|自营', 'gpt-5.3-codex', 1, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Codex|自营', 'gpt-5.4', 1, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Codex|自营', 'gpt-5.4-mini', 1, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Codex|自营', 'gpt-5.4-thinking', 1, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('DeepSeek|自营', 'deepseek-3.1', 9, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('DeepSeek|自营', 'deepseek-3.1-terminus', 9, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('DeepSeek|自营', 'deepseek-3.2', 2, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('DeepSeek|自营', 'deepseek-3.2', 9, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('DeepSeek|自营', 'deepseek-3.2-thinking', 2, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-2.5-flash', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-2.5-flash-lite', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3-flash', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3-flash-preview', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3-pro-preview', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3.1-flash-lite-preview', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3.1-pro', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3.1-pro-high', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3.1-pro-low', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|反代', 'gemini-3.1-pro-preview', 29, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|多媒体', 'gemini-3.1-flash-image', 30, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|多媒体', 'gemini-3.1-flash-image-preview', 30, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('Gemini|多媒体', 'nano-banana', 21, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-3', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-3-mini', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-3-thinking', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-4', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-4-thinking', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-4.1-fast', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-4.1-mini', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-4.1-thinking', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Grok|自营', 'grok-4.20-beta', 7, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'dance2-fast-10s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'dance2-fast-15s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'dance2-fast-5s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-3.0', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-3.1', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-4.0', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-4.1', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-4.5', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-agent', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.0', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.0-10s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.0-fast', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.0-fast-10s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.0-pro', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.0-pro-10s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.5-pro', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.5-pro-10s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'jimeng-video-3.5-pro-12s', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'seedream-4.6', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('JiMeng|多媒体', 'seedream-5.0', 22, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Kimi|自营', 'kimi-k2-instruct', 8, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Kimi|自营', 'kimi-k2-instruct-0905', 8, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Kimi|自营', 'kimi-k2-thinking', 8, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Kimi|自营', 'kimi-k2.5', 8, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('MiniMax|自营', 'minimax-m2.1', 5, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('MiniMax|自营', 'minimax-m2.1-thinking', 5, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('MiniMax|自营', 'minimax-m2.5', 5, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('MiniMax|自营', 'minimax-m2.5', 10, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('MiniMax|自营', 'minimax-m2.5-thinking', 5, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3-coder-480b-a35b-instruct', 11, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3-coder-next', 4, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3-coder-next-thinking', 4, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3-coder-plus', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3-coder-plus-thinking-search', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-122b-a10b', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-122b-a10b', 11, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-122b-a10b-thinking-search', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-397b-a17b', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-397b-a17b', 11, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-397b-a17b-thinking-search', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-flash', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-flash-thinking-search', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-max', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-max-thinking-search', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-plus', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('Qwen|自营', 'qwen3.5-plus-thinking-search', 3, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('ZhiPu|自营', 'glm-4.7', 27, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('ZhiPu|自营', 'glm-5', 6, 1, 0, 0, '');
INSERT INTO `abilities` VALUES ('ZhiPu|自营', 'glm-5', 27, 0, 0, 0, '');
INSERT INTO `abilities` VALUES ('ZhiPu|自营', 'glm-5-thinking', 6, 1, 0, 0, '');

-- ----------------------------
-- Table structure for channels
-- ----------------------------
DROP TABLE IF EXISTS `channels`;
CREATE TABLE `channels`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` bigint NULL DEFAULT 0,
  `key` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `open_ai_organization` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `test_model` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `status` bigint NULL DEFAULT 1,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `weight` bigint UNSIGNED NULL DEFAULT 0,
  `created_time` bigint NULL DEFAULT NULL,
  `test_time` bigint NULL DEFAULT NULL,
  `response_time` bigint NULL DEFAULT NULL,
  `base_url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `other` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `balance` double NULL DEFAULT NULL,
  `balance_updated_time` bigint NULL DEFAULT NULL,
  `models` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'default',
  `used_quota` bigint NULL DEFAULT 0,
  `model_mapping` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `status_code_mapping` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `priority` bigint NULL DEFAULT 0,
  `auto_ban` bigint NULL DEFAULT 1,
  `other_info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `tag` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `setting` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `param_override` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `header_override` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `channel_info` json NULL,
  `settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_channels_name`(`name` ASC) USING BTREE,
  INDEX `idx_channels_tag`(`tag` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of channels
-- ----------------------------
INSERT INTO `channels` VALUES (1, 1, 'AIzaSyAcFFmsCMFnhnp2azcav3RFQgdv4zHmjyA', '', 'gpt-5.4', 1, 'Codex_CPA', 0, 1775830514, 1776657834, 3517, 'https://proxy.cli.jians.org', '', 0, 0, 'gpt-5.3-codex,gpt-5.2,gpt-5.4-mini,gpt-5.4,gpt-5.4-thinking', 'Codex|自营', 43415244, '{\n  \"gpt-5.4-thinking\": \"gpt-5.4-xhigh\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Codex_CPA_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (2, 1, 'sk-z6qMpyS3xNWd1b9BgQM5tK0REu8bgSLO', '', '', 1, 'DeepSeek_Kiro', 0, 1775831720, 1776658721, 4693, 'https://proxy.kiro.jians.org', '', 0, 0, 'deepseek-3.2,deepseek-3.2-thinking', 'DeepSeek|自营', 1433897, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'DeepSeek_Kiro_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (3, 1, '27125zhu', '', '', 1, 'Qwen_Web', 0, 1775832646, 1775832767, 10931, 'http://proxy.qwen.web.jians.org', '', 0, 0, 'qwen3.5-plus,qwen3.5-plus-thinking-search,qwen3.5-flash-thinking-search,qwen3.5-flash,qwen3.5-397b-a17b,qwen3.5-397b-a17b-thinking-search,qwen3.5-122b-a10b,qwen3.5-122b-a10b-thinking-search,qwen3-coder-plus,qwen3-coder-plus-thinking-search,qwen3.5-max-thinking-search,qwen3.5-max', 'Qwen|自营', 0, '{\n  \"qwen3.5-max-thinking-search\": \"qwen-max-latest-thinking-search\",\n  \"qwen3.5-max\": \"qwen-max-latest\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Qwen_Web_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (4, 1, 'sk-z6qMpyS3xNWd1b9BgQM5tK0REu8bgSLO', '', '', 1, 'Qwen_Kiro', 0, 1775832884, 1775834370, 5469, 'https://proxy.kiro.jians.org', '', 0, 0, 'qwen3-coder-next,qwen3-coder-next-thinking', 'Qwen|自营', 0, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Qwen_Kiro_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (5, 1, 'sk-z6qMpyS3xNWd1b9BgQM5tK0REu8bgSLO', '', '', 1, 'MinMax_Kiro', 0, 1775835027, 1775835155, 5240, 'https://proxy.kiro.jians.org', '', 0, 0, 'minimax-m2.5,minimax-m2.1,minimax-m2.5-thinking,minimax-m2.1-thinking', 'MiniMax|自营', 0, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'MinMax_Kiro_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (6, 1, 'sk-z6qMpyS3xNWd1b9BgQM5tK0REu8bgSLO', '', '', 1, 'ZhiPu_Kiro', 0, 1775835311, 1776348713, 4795, 'https://proxy.kiro.jians.org', '', 0, 0, 'glm-5,glm-5-thinking', 'ZhiPu|自营', 1977896, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'ZhiPu_Kiro_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (7, 1, 'AIzaSyAcFFmsCMFnhnp2azcav3RFQgdv4zHmjyA', '', '', 1, 'Grok_Web', 0, 1775835719, 1775835732, 3301, 'https://proxy.grok.jians.org', '', 0, 0, 'grok-3,grok-3-thinking,grok-3-mini,grok-4-thinking,grok-4,grok-4.1-fast,grok-4.1-mini,grok-4.1-thinking,grok-4.20-beta', 'Grok|自营', 0, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Grok_Web_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (8, 1, 'AIzaSyAcFFmsCMFnhnp2azcav3RFQgdv4zHmjyA', '', '', 1, 'Kimi_CPA', 0, 1775835968, 1775836198, 4099, 'https://proxy.cli.jians.org', '', 0, 0, 'kimi-k2-thinking,kimi-k2-instruct,kimi-k2-instruct-0905,kimi-k2.5', 'Kimi|自营', 0, '{\n  \"kimi-k2-thinking\": \"moonshotai/kimi-k2-thinking\",\n  \"kimi-k2-instruct\": \"moonshotai/kimi-k2-instruct\",\n  \"kimi-k2-instruct-0905\": \"moonshotai/kimi-k2-instruct-0905\",\n  \"kimi-k2.5\": \"moonshotai/kimi-k2.5\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Kimi_CPA_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (9, 1, 'AIzaSyAcFFmsCMFnhnp2azcav3RFQgdv4zHmjyA', '', '', 2, 'DeepSeek_CPA', 0, 1775836391, 1776673495, 24247, 'https://proxy.cli.jians.org', '', 0, 0, 'deepseek-3.2,deepseek-3.1,deepseek-3.1-terminus', 'DeepSeek|自营', 0, '{\n  \"deepseek-3.2\": \"deepseek-ai/deepseek-v3.2\",\n  \"deepseek-3.1\": \"deepseek-ai/deepseek-v3.1\",\n  \"deepseek-3.1-terminus\": \"deepseek-ai/deepseek-v3.1-terminus\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'DeepSeek_CPA_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (10, 1, 'AIzaSyAcFFmsCMFnhnp2azcav3RFQgdv4zHmjyA', '', '', 1, 'MinMax_CPA', 0, 1775836605, 1775836611, 1318, 'https://proxy.cli.jians.org', '', 0, 0, 'minimax-m2.5', 'MiniMax|自营', 0, '{\n  \"minimax-m2.5\": \"minimaxai/minimax-m2.5\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'MinMax_CPA_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (11, 1, 'AIzaSyAcFFmsCMFnhnp2azcav3RFQgdv4zHmjyA', '', '', 1, 'Qwen_CPA', 0, 1775837021, 1775958953, 1644, 'https://proxy.cli.jians.org', '', 0, 0, 'qwen3.5-122b-a10b,qwen3.5-397b-a17b,qwen3-coder-480b-a35b-instruct', 'Qwen|自营', 0, '{\n  \"qwen3.5-397b-a17b\": \"qwen/qwen3.5-397b-a17b\",\n  \"qwen3-coder-480b-a35b-instruct\": \"qwen/qwen3-coder-480b-a35b-instruct\",\n  \"qwen3.5-122b-a10b\": \"qwen/qwen3.5-122b-a10b\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Qwen_CPA_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (12, 1, 'sk-zGEOGhsir9hrfdNzDu9f8ShOYRuuo7Fe773GjuUHrHSt7Bkt', '', '', 2, 'Claude_企业渠道', 0, 1775838045, 1776162331, 6218, 'http://muxufo.com', '', 0, 0, 'claude-sonnet-4-6,claude-haiku-4-5,claude-opus-4-1,claude-opus-4,claude-opus-4-5,claude-opus-4-6,claude-sonnet-4-thinking,claude-haiku-4-5-thinking,claude-opus-4-1-thinking,claude-opus-4-thinking,claude-opus-4-5-thinking,claude-sonnet-4,claude-sonnet-4-5', 'Claude|企业', 529894, '{\n  \"claude-haiku-4-5\": \"claude-haiku-4-5-20251001\",\n  \"claude-opus-4-1\": \"claude-opus-4-1-20250805\",\n  \"claude-opus-4\": \"claude-opus-4-20250514\",\n  \"claude-opus-4-5\": \"claude-opus-4-5-20251101\",\n  \"claude-opus-4-6\": \"claude-opus-4-6\",\n  \"claude-sonnet-4-thinking\": \"claude-sonnet-4-20250514-thinking\",\n  \"claude-haiku-4-5-thinking\": \"claude-haiku-4-5-20251001-thinking\",\n  \"claude-opus-4-1-thinking\": \"claude-opus-4-1-20250805-thinking\",\n  \"claude-opus-4-thinking\": \"claude-opus-4-20250514-thinking\",\n  \"claude-opus-4-5-thinking\": \"claude-opus-4-5-20251101-thinking\",\n  \"claude-sonnet-4\": \"claude-sonnet-4-20250514\",\n  \"claude-sonnet-4-5\": \"claude-sonnet-4-5-20250929\",\n  \"claude-sonnet-4-6\": \"claude-sonnet-4-6\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Claude_企业渠道_女娲', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (13, 1, 'sk-DvX7qEWaQCm6m65comvl1I1IlviqqesTc2wrfb1KLWKnKrue', '', '', 1, 'Cluade_AWS企业', 0, 1775841530, 1776324394, 13739, 'https://api09.apiopen.com.cn', '', 0, 0, 'claude-sonnet-4-6,claude-opus-4-6,claude-opus-4-6-thinking,claude-sonnet-4-6-thinking', 'Claude|企业', 8293, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Cluade_AWS企业_光Ni', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (14, 1, 'sk-0LwCIVwxghKigKIxmlBHa1QjIW2F1eVCav6Yx8bfD0Ngtf90', '', '', 1, 'Claude_CC Max', 0, 1775842134, 1775842143, 5413, 'https://api09.apiopen.com.cn', '', 0, 0, 'claude-opus-4-6,claude-sonnet-4-6,claude-sonnet-4-5,claude-opus-4-5', 'Claude|官转', 0, '{\n  \"claude-sonnet-4-5\": \"claude-sonnet-4-5-20250929\",\n  \"claude-opus-4-5\": \"claude-opus-4-5-20251101\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Claude_CC Max_光Ni', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (15, 1, 'sk-mBLqVyDPqpzl02cgFzOiYdZIX4MO8OX8i7efEe4CLXI5qHb2', '', '', 1, 'Claude_Aws官优质', 0, 1775842301, 1776324374, 7259, 'https://api09.apiopen.com.cn', '', 0, 0, 'claude-sonnet-4-6-thinking,claude-sonnet-4-6,claude-opus-4-6,claude-opus-4-6-thinking', 'Claude|企业', 393270, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Claude_Aws官优质_光Ni', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (16, 1, 'sk-yDb03YrlvgiqzlHmBFnbpjPOzvn3EC2nd3FqdRjjeRIsrgBp', '', '', 2, 'Cluade_Azure', 0, 1775842692, 1775842700, 4524, 'https://api09.apiopen.com.cn', '', 0, 0, 'claude-opus-4-6,claude-sonnet-4-6', 'Claude|企业', 0, '{\n  \"claude-sonnet-4-6\": \"claude-sonnet-4-6\",\n  \"claude-opus-4-6\": \"claude-opus-4-6\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Cluade_Azure_光Ni', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (19, 14, 'sk-23ced289afda74d54f87274ea264010cf56bf524ebbb764b9a9572e211314e20', NULL, '', 2, 'Claude_反重力', 0, 1775875366, 1776738235, 2745, 'https://ai.claudei.cn', '', 0, 0, 'claude-opus-4-5,claude-opus-4-6,claude-opus-4-6-thinking,claude-sonnet-4-6', 'Claude|反代', 295632329, '{\n  \"claude-opus-4-5\": \"claude-opus-4-5-20251101\",\n  \"claude-opus-4-6\": \"claude-opus-4-6\",\n  \"claude-opus-4-6-thinking\": \"claude-opus-4-6-thinking\",\n  \"claude-sonnet-4-6\": \"claude-sonnet-4-6\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Claude_反重力_嘟嘟', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"allow_inference_geo\":false,\"claude_beta_query\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (20, 14, 'sk-taHI9uLKcEP3gQTrSnZcqcdhkL5ItzFVkPbXjz4s6FJHCx7U', '', '', 2, 'Claude_Kiro 反代', 0, 1775915464, 1776497724, 5907, 'https://api09.apiopen.com.cn', '', 0, 0, 'claude-opus-4-6,claude-sonnet-4-6,claude-opus-4-6-thinking', 'Claude|反代|特价', 71985833, '{\n  \"claude-sonnet-4-6\": \"claude-sonnet-4-6\",\n  \"claude-opus-4-6\": \"claude-opus-4-6\",\n  \"claude-opus-4-6-thinking\": \"claude-opus-4-6\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Claude_Kiro 反代_光Ni', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"allow_inference_geo\":false,\"claude_beta_query\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (21, 1, 'sk-15kgt9KeyI1jboRqbAsTx2YnZYIUyTO1L2pklKIhBXPOv5W5', '', '', 1, 'Gemini_多媒体', 0, 1775922219, 1775922584, 34238, 'https://api.xbyjs.top', '', 0, 0, 'nano-banana', 'Gemini|多媒体', 0, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Gemini_多媒体_小北渠道', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (22, 1, 'sk-9yTdFiYea01tk4oH2cBj5a9amRPlC2gGBQARW98qyjhhZO6q', '', '', 1, 'JiMeng_多媒体', 0, 1775922761, 0, 0, 'https://api.xbyjs.top', '', 0, 0, 'jimeng-3.1,jimeng-3.0,jimeng-4.0,jimeng-4.5,jimeng-video-3.0,jimeng-video-3.0-fast,jimeng-video-3.0-pro,jimeng-video-3.5-pro,jimeng-video-3.5-pro-12s,jimeng-video-3.5-pro-10s,jimeng-video-3.0-pro-10s,jimeng-video-3.0-fast-10s,jimeng-video-3.0-10s,jimeng-agent,jimeng-4.1,seedream-5.0,seedream-4.6,dance2-fast-5s,dance2-fast-10s,dance2-fast-15s', 'JiMeng|多媒体', 0, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'JiMeng_多媒体_小北渠道', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (23, 14, 'sk-z6qMpyS3xNWd1b9BgQM5tK0REu8bgSLO', '', '', 1, 'Claude_Kiro 反代', 0, 1776145112, 1776497740, 1617, 'https://proxy.kiro.jians.org', '', 0, 0, 'claude-sonnet-4-5,claude-sonnet-4,claude-haiku-4-5,claude-haiku-4-5-thinking,claude-sonnet-4-thinking,claude-sonnet-4-5-thinking', 'Claude|反代|特价', 0, '{\n  \"claude-sonnet-4-5\": \"claude-sonnet-4.5\",\n  \"claude-sonnet-4\": \"claude-sonnet-4\",\n  \"claude-haiku-4-5\": \"claude-haiku-4.5\",\n  \"claude-haiku-4-5-thinking\": \"claude-haiku-4.5-thinking\",\n  \"claude-sonnet-4-thinking\": \"claude-sonnet-4-thinking\",\n  \"claude-sonnet-4-5-thinking\": \"claude-sonnet-4.5-thinking\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Claude_Kiro 反代_自营号池', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"allow_inference_geo\":false,\"claude_beta_query\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (24, 14, 'sk-g757f3X5i7IdKYltaAE2kzUdo8WRB7AhSsAm4UnRb42DIIcG', '', 'claude-sonnet-4-6', 1, 'Claude_反重力', 0, 1776176834, 1776738545, 3991, 'https://us.llmgate.io', '', 0, 0, 'claude-opus-4-6-thinking,claude-opus-4-6,claude-sonnet-4-6', 'Claude|反代', 1098551039, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', '{\n\"cache_control\": { \"type\": \"ephemeral\" },\n}', 'Claude_反重力_骗你是小猪', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"allow_inference_geo\":false,\"claude_beta_query\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (25, 1, 'sk-G58h3tdIXNkXIF6w2pJYlZpbfRL5k38UWXMl7g1bskAuFCYg', '', '', 1, 'Claude_Aws 高V', 0, 1776225887, 1776324359, 10930, 'https://api09.apiopen.com.cn', '', 0, 0, 'claude-sonnet-4-6,claude-opus-4-6,claude-opus-4-6-thinking,claude-sonnet-4-6-thinking', 'Claude|企业', 2125, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, 'Claude_Aws 高V_光Ni', '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (26, 14, 'sk-Kgpns9uCEFJdLhv352gsVIoT0x2dvkXhASKHdkRkh3VH9YMR', NULL, '', 2, 'Claude_Aws', 0, 1776322416, 1776322720, 2520, 'https://cc.aiclaude.club', '', 0, 0, 'claude-opus-4-6-thinking,claude-sonnet-4-6,claude-opus-4-6,claude-sonnet-4-6-thinking', 'Claude|企业', 5265968, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, NULL, '{\"is_multi_key\": false, \"multi_key_mode\": \"\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"allow_inference_geo\":false,\"claude_beta_query\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (27, 1, 'AIzaSyAcFFmsCMFnhnp2azcav3RFQgdv4zHmjyA', '', '', 2, 'ZhiPu_CPA', 0, 1776359330, 1776398910, 27136, 'https://proxy.cli.jians.org', '', 0, 0, 'glm-5,glm-4.7', 'ZhiPu|自营', 0, '{\n  \"glm-4.7\": \"z-ai/glm4.7\",\n  \"glm-5\": \"z-ai/glm5\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, NULL, '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (28, 1, 'sk-ms3fDDhcrrve8vKE0qlVBoo219a5W3YCZRGjbC2o9yt91nVn', '', '', 1, 'Cluade_反重力', 0, 1776426187, 1776587944, 89430, 'https://5585387.xyz', '', 0, 0, 'claude-opus-4-6', 'Claude|反代|特价', 11208825, '{\n  \"claude-opus-4-6\": \"claude-opus-4-6-thinking\"\n}', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, NULL, '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (29, 1, 'sk-FMUJ467IXvTfmruqzw2PoX5NUqGFgDQAIpGFgzG0DD8Do4Hh', '', '', 1, 'Gemini_反重力', 0, 1776578353, 1776578865, 4300, 'https://llmgate.io', '', 0, 0, 'gemini-3.1-pro,gemini-3-flash,gemini-3-pro-preview,gemini-2.5-flash-lite,gemini-3.1-pro-low,gemini-2.5-flash,gemini-3.1-flash-lite-preview,gemini-3.1-pro-high,gemini-3.1-pro-preview,gemini-3-flash-preview', 'Gemini|反代', 13954529, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, NULL, '{\"is_multi_key\": false, \"multi_key_mode\": \"random\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');
INSERT INTO `channels` VALUES (30, 1, 'sk-gEoxzTVhKVf4J0PujYlDaghcrGThJkCptX2ny77H1aLzwRAr', '', '', 2, 'Gemini_反重力_多媒体', 0, 1776582912, 1776583068, 2273, 'https://llmgate.io', '', 0, 0, 'gemini-3.1-flash-image-preview,gemini-3.1-flash-image', 'Gemini|多媒体', 0, '', '', 0, 1, '', '', '{\"force_format\":false,\"thinking_to_content\":false,\"proxy\":\"\",\"pass_through_body_enabled\":false,\"system_prompt\":\"\",\"system_prompt_override\":false}', '', NULL, NULL, '{\"is_multi_key\": false, \"multi_key_mode\": \"\", \"multi_key_size\": 0, \"multi_key_status_list\": null, \"multi_key_polling_index\": 0}', '{\"allow_service_tier\":false,\"disable_store\":false,\"allow_safety_identifier\":false,\"allow_include_obfuscation\":false,\"upstream_model_update_check_enabled\":false,\"upstream_model_update_auto_sync_enabled\":false,\"upstream_model_update_ignored_models\":[],\"upstream_model_update_last_detected_models\":[],\"upstream_model_update_last_check_time\":0}');

-- ----------------------------
-- Table structure for checkins
-- ----------------------------
DROP TABLE IF EXISTS `checkins`;
CREATE TABLE `checkins`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `checkin_date` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `quota_awarded` bigint NOT NULL,
  `created_at` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_user_checkin_date`(`user_id` ASC, `checkin_date` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of checkins
-- ----------------------------

-- ----------------------------
-- Table structure for custom_oauth_providers
-- ----------------------------
DROP TABLE IF EXISTS `custom_oauth_providers`;
CREATE TABLE `custom_oauth_providers`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `enabled` tinyint(1) NULL DEFAULT 0,
  `client_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `client_secret` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `authorization_endpoint` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `token_endpoint` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_info_endpoint` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `scopes` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'openid profile email',
  `user_id_field` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'sub',
  `username_field` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'preferred_username',
  `display_name_field` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'name',
  `email_field` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'email',
  `well_known` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `auth_style` bigint NULL DEFAULT 0,
  `access_policy` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `access_denied_message` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` datetime(3) NULL DEFAULT NULL,
  `updated_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_custom_oauth_providers_slug`(`slug` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of custom_oauth_providers
-- ----------------------------

-- ----------------------------
-- Table structure for logs
-- ----------------------------
DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL,
  `created_at` bigint NULL DEFAULT NULL,
  `type` bigint NULL DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `token_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `model_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `quota` bigint NULL DEFAULT 0,
  `prompt_tokens` bigint NULL DEFAULT 0,
  `completion_tokens` bigint NULL DEFAULT 0,
  `use_time` bigint NULL DEFAULT 0,
  `is_stream` tinyint(1) NULL DEFAULT NULL,
  `channel_id` bigint NULL DEFAULT NULL,
  `channel_name` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `token_id` bigint NULL DEFAULT 0,
  `group` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `ip` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `request_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `other` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_logs_model_name`(`model_name` ASC) USING BTREE,
  INDEX `idx_logs_token_id`(`token_id` ASC) USING BTREE,
  INDEX `idx_logs_group`(`group` ASC) USING BTREE,
  INDEX `idx_created_at_id`(`id` ASC, `created_at` ASC) USING BTREE,
  INDEX `idx_logs_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_created_at_type`(`created_at` ASC, `type` ASC) USING BTREE,
  INDEX `idx_logs_username`(`username` ASC) USING BTREE,
  INDEX `idx_logs_token_name`(`token_name` ASC) USING BTREE,
  INDEX `idx_logs_channel_id`(`channel_id` ASC) USING BTREE,
  INDEX `idx_logs_ip`(`ip` ASC) USING BTREE,
  INDEX `idx_logs_request_id`(`request_id` ASC) USING BTREE,
  INDEX `idx_user_id_id`(`user_id` ASC, `id` ASC) USING BTREE,
  INDEX `index_username_model_name`(`model_name` ASC, `username` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of logs
-- ----------------------------

-- ----------------------------
-- Table structure for midjourneys
-- ----------------------------
DROP TABLE IF EXISTS `midjourneys`;
CREATE TABLE `midjourneys`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` bigint NULL DEFAULT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `action` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `mj_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `prompt` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `prompt_en` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `state` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `submit_time` bigint NULL DEFAULT NULL,
  `start_time` bigint NULL DEFAULT NULL,
  `finish_time` bigint NULL DEFAULT NULL,
  `image_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `video_url` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `video_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `progress` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `fail_reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `channel_id` bigint NULL DEFAULT NULL,
  `quota` bigint NULL DEFAULT NULL,
  `buttons` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `properties` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_midjourneys_start_time`(`start_time` ASC) USING BTREE,
  INDEX `idx_midjourneys_finish_time`(`finish_time` ASC) USING BTREE,
  INDEX `idx_midjourneys_status`(`status` ASC) USING BTREE,
  INDEX `idx_midjourneys_progress`(`progress` ASC) USING BTREE,
  INDEX `idx_midjourneys_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_midjourneys_action`(`action` ASC) USING BTREE,
  INDEX `idx_midjourneys_mj_id`(`mj_id` ASC) USING BTREE,
  INDEX `idx_midjourneys_submit_time`(`submit_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of midjourneys
-- ----------------------------

-- ----------------------------
-- Table structure for models
-- ----------------------------
DROP TABLE IF EXISTS `models`;
CREATE TABLE `models`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `model_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `vendor_id` bigint NULL DEFAULT NULL,
  `endpoints` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `status` bigint NULL DEFAULT 1,
  `sync_official` bigint NULL DEFAULT 1,
  `created_time` bigint NULL DEFAULT NULL,
  `updated_time` bigint NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  `name_rule` bigint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_model_name_delete_at`(`model_name` ASC, `deleted_at` ASC) USING BTREE,
  INDEX `idx_models_vendor_id`(`vendor_id` ASC) USING BTREE,
  INDEX `idx_models_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 101 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of models
-- ----------------------------
INSERT INTO `models` VALUES (1, 'claude-haiku-4-5', '', '', '', 1, '', 1, 0, 1775875638, 1775875638, NULL, 0);
INSERT INTO `models` VALUES (2, 'claude-haiku-4-5-thinking', '', '', '', 1, '', 1, 0, 1775875646, 1775875646, NULL, 0);
INSERT INTO `models` VALUES (3, 'claude-opus-4', '', '', '', 1, '', 1, 0, 1775875655, 1775875655, NULL, 0);
INSERT INTO `models` VALUES (4, 'claude-opus-4-1', '', '', '', 1, '', 1, 0, 1775875662, 1775875662, NULL, 0);
INSERT INTO `models` VALUES (5, 'claude-opus-4-1-thinking', '', '', '', 1, '', 1, 0, 1775875670, 1775875670, NULL, 0);
INSERT INTO `models` VALUES (6, 'claude-opus-4-5', '', '', '', 1, '', 1, 0, 1775875678, 1775875678, NULL, 0);
INSERT INTO `models` VALUES (7, 'claude-opus-4-5-thinking', '', '', '', 1, '', 1, 0, 1775875684, 1775875684, NULL, 0);
INSERT INTO `models` VALUES (8, 'claude-opus-4-6', '', '', '', 1, '', 1, 0, 1775875702, 1775875702, NULL, 0);
INSERT INTO `models` VALUES (9, 'claude-opus-4-thinking', '', '', '', 1, '', 1, 0, 1775875719, 1775875719, NULL, 0);
INSERT INTO `models` VALUES (10, 'claude-sonnet-4', '', '', '', 1, '', 1, 0, 1775875735, 1775875735, NULL, 0);
INSERT INTO `models` VALUES (11, 'claude-sonnet-4-5', '', '', '', 1, '', 1, 0, 1775875742, 1775875742, NULL, 0);
INSERT INTO `models` VALUES (12, 'claude-sonnet-4-5-thinking', '', '', '', 1, '', 1, 0, 1775875749, 1775875749, NULL, 0);
INSERT INTO `models` VALUES (13, 'claude-sonnet-4-6', '', '', '', 1, '', 1, 0, 1775875755, 1775875755, NULL, 0);
INSERT INTO `models` VALUES (14, 'claude-sonnet-4-6-thinking', '', '', '', 1, '', 1, 0, 1775875824, 1775875824, NULL, 0);
INSERT INTO `models` VALUES (15, 'claude-sonnet-4-thinking', '', '', '', 1, '', 1, 0, 1775875832, 1775875832, NULL, 0);
INSERT INTO `models` VALUES (16, 'claude-opus-4-6-thinking', '', '', '', 1, '', 1, 0, 1775875843, 1775875843, NULL, 0);
INSERT INTO `models` VALUES (17, 'gpt-5', '', '', '', 2, '[\"openai\"]', 1, 0, 1775875857, 1775876506, NULL, 0);
INSERT INTO `models` VALUES (18, 'gpt-5-codex', '', '', '', 2, '[\"openai\"]', 1, 0, 1775875864, 1775876499, NULL, 0);
INSERT INTO `models` VALUES (19, 'gpt-5-codex-mini', '', '', '', 2, '', 1, 0, 1775875875, 1775875875, NULL, 0);
INSERT INTO `models` VALUES (20, 'gpt-5.1', '', '', '', 2, '', 1, 0, 1775875883, 1775875883, NULL, 0);
INSERT INTO `models` VALUES (21, 'gpt-5.1-codex', '', '', '', 2, '', 1, 0, 1775875894, 1775875894, NULL, 0);
INSERT INTO `models` VALUES (22, 'gpt-5.1-codex-max', '', '', '', 2, '', 1, 0, 1775875900, 1775875900, NULL, 0);
INSERT INTO `models` VALUES (23, 'gpt-5.1-codex-mini', '', '', '', 2, '', 1, 0, 1775875906, 1775875906, NULL, 0);
INSERT INTO `models` VALUES (24, 'gpt-5.2', '', '', '', 2, '', 1, 0, 1775875922, 1775875922, NULL, 0);
INSERT INTO `models` VALUES (25, 'gpt-5.2-codex', '', '', '', 2, '', 1, 0, 1775875928, 1775875928, NULL, 0);
INSERT INTO `models` VALUES (26, 'gpt-5.3-codex', '', '', '', 2, '', 1, 0, 1775875934, 1775875934, NULL, 0);
INSERT INTO `models` VALUES (27, 'gpt-5.4', '', '', '', 2, '', 1, 0, 1775875940, 1775875940, NULL, 0);
INSERT INTO `models` VALUES (28, 'gpt-5.4-mini', '', '', '', 2, '', 1, 0, 1775875949, 1775875949, NULL, 0);
INSERT INTO `models` VALUES (29, 'gpt-oss-120b-medium', '', '', '', 2, '', 1, 0, 1775875960, 1775875960, NULL, 0);
INSERT INTO `models` VALUES (30, 'deepseek-3.1', '', '', '', 3, '', 1, 0, 1775875977, 1775875977, NULL, 0);
INSERT INTO `models` VALUES (31, 'deepseek-3.1-terminus', '', '', '', 3, '', 1, 0, 1775875985, 1775875985, NULL, 0);
INSERT INTO `models` VALUES (32, 'deepseek-3.2', '', '', '', 3, '', 1, 0, 1775875991, 1775875991, NULL, 0);
INSERT INTO `models` VALUES (33, 'deepseek-3.2-thinking', '', '', '', 3, '', 1, 0, 1775876003, 1775876003, NULL, 0);
INSERT INTO `models` VALUES (34, 'grok-3', '', '', '', 4, '', 1, 0, 1775876011, 1775876011, NULL, 0);
INSERT INTO `models` VALUES (35, 'grok-3-mini', '', '', '', 4, '', 1, 0, 1775876018, 1775876018, NULL, 0);
INSERT INTO `models` VALUES (36, 'grok-3-thinking', '', '', '', 4, '', 1, 0, 1775876025, 1775876025, NULL, 0);
INSERT INTO `models` VALUES (37, 'grok-4', '', '', '', 4, '', 1, 0, 1775876033, 1775876033, NULL, 0);
INSERT INTO `models` VALUES (38, 'grok-4-thinking', '', '', '', 4, '', 1, 0, 1775876039, 1775876039, NULL, 0);
INSERT INTO `models` VALUES (39, 'grok-4.1-fast', '', '', '', 4, '', 1, 0, 1775876048, 1775876048, NULL, 0);
INSERT INTO `models` VALUES (40, 'grok-4.1-mini', '', '', '', 4, '', 1, 0, 1775876072, 1775876072, NULL, 0);
INSERT INTO `models` VALUES (41, 'grok-4.1-thinking', '', '', '', 4, '', 1, 0, 1775876078, 1775876078, NULL, 0);
INSERT INTO `models` VALUES (42, 'grok-4.20-beta', '', '', '', 4, '', 1, 0, 1775876085, 1775876085, NULL, 0);
INSERT INTO `models` VALUES (43, 'kimi-k2-instruct', '', '', '', 5, '', 1, 0, 1775876097, 1775876097, NULL, 0);
INSERT INTO `models` VALUES (44, 'kimi-k2-instruct-0905', '', '', '', 5, '', 1, 0, 1775876104, 1775876104, NULL, 0);
INSERT INTO `models` VALUES (45, 'kimi-k2-thinking', '', '', '', 5, '', 1, 0, 1775876113, 1775876113, NULL, 0);
INSERT INTO `models` VALUES (46, 'kimi-k2.5', '', '', '', 5, '', 1, 0, 1775876119, 1775876119, NULL, 0);
INSERT INTO `models` VALUES (47, 'minimax-m2.1', '', '', '', 8, '', 1, 0, 1775876177, 1775876177, NULL, 0);
INSERT INTO `models` VALUES (48, 'minimax-m2.1-thinking', '', '', '', 8, '', 1, 0, 1775876183, 1775876183, NULL, 0);
INSERT INTO `models` VALUES (49, 'minimax-m2.5', '', '', '', 8, '', 1, 0, 1775876189, 1775876189, NULL, 0);
INSERT INTO `models` VALUES (50, 'minimax-m2.5-thinking', '', '', '', 8, '', 1, 0, 1775876196, 1775876196, NULL, 0);
INSERT INTO `models` VALUES (51, 'qwen3-coder-480b-a35b-instruct', '', '', '', 6, '', 1, 0, 1775876206, 1775876206, NULL, 0);
INSERT INTO `models` VALUES (52, 'qwen3-coder-next', '', '', '', 6, '', 1, 0, 1775876212, 1775876212, NULL, 0);
INSERT INTO `models` VALUES (53, 'qwen3-coder-next-thinking', '', '', '', 6, '', 1, 0, 1775876230, 1775876230, NULL, 0);
INSERT INTO `models` VALUES (54, 'qwen3-coder-plus', '', '', '', 6, '', 1, 0, 1775876236, 1775876236, NULL, 0);
INSERT INTO `models` VALUES (55, 'qwen3-coder-plus-thinking-search', '', '', '', 6, '', 1, 0, 1775876242, 1775876242, NULL, 0);
INSERT INTO `models` VALUES (56, 'qwen3.5-122b-a10b', '', '', '', 6, '', 1, 0, 1775876394, 1775876394, NULL, 0);
INSERT INTO `models` VALUES (57, 'qwen3.5-122b-a10b-thinking-search', '', '', '', 6, '', 1, 0, 1775876400, 1775876400, NULL, 0);
INSERT INTO `models` VALUES (58, 'qwen3.5-397b-a17b', '', '', '', 6, '', 1, 0, 1775876407, 1775876407, NULL, 0);
INSERT INTO `models` VALUES (59, 'qwen3.5-397b-a17b-thinking-search', '', '', '', 6, '', 1, 0, 1775876413, 1775876413, NULL, 0);
INSERT INTO `models` VALUES (60, 'qwen3.5-flash', '', '', '', 6, '', 1, 0, 1775876421, 1775876421, NULL, 0);
INSERT INTO `models` VALUES (61, 'qwen3.5-flash-thinking-search', '', '', '', 6, '', 1, 0, 1775876427, 1775876427, NULL, 0);
INSERT INTO `models` VALUES (62, 'qwen3.5-max', '', '', '', 6, '', 1, 0, 1775876435, 1775876435, NULL, 0);
INSERT INTO `models` VALUES (63, 'qwen3.5-max-thinking-search', '', '', '', 6, '', 1, 0, 1775876442, 1775876442, NULL, 0);
INSERT INTO `models` VALUES (64, 'qwen3.5-plus', '', '', '', 6, '', 1, 0, 1775876449, 1775876449, NULL, 0);
INSERT INTO `models` VALUES (65, 'qwen3.5-plus-thinking-search', '', '', '', 6, '', 1, 0, 1775876455, 1775876455, NULL, 0);
INSERT INTO `models` VALUES (66, 'glm-5', '', '', '', 7, '[\"openai\"]', 1, 0, 1775876461, 1775876476, NULL, 0);
INSERT INTO `models` VALUES (67, 'glm-5-thinking', '', '', '', 7, '', 1, 0, 1775876484, 1775876484, NULL, 0);
INSERT INTO `models` VALUES (68, 'nano-banana', '', '', '', 9, '', 1, 0, 1775922323, 1775922323, NULL, 0);
INSERT INTO `models` VALUES (69, 'dance2-fast-10s', '', '', '', 10, '', 1, 0, 1775924672, 1775924672, NULL, 0);
INSERT INTO `models` VALUES (70, 'dance2-fast-15s', '', '', '', 10, '', 1, 0, 1775924681, 1775924681, NULL, 0);
INSERT INTO `models` VALUES (71, 'dance2-fast-5s', '', '', '', 10, '', 1, 0, 1775924688, 1775924688, NULL, 0);
INSERT INTO `models` VALUES (72, 'jimeng-3.0', '', '', '', 10, '', 1, 0, 1775924695, 1775924695, NULL, 0);
INSERT INTO `models` VALUES (73, 'jimeng-3.1', '', '', '', 10, '', 1, 0, 1775924702, 1775924702, NULL, 0);
INSERT INTO `models` VALUES (74, 'jimeng-4.0', '', '', '', 10, '', 1, 0, 1775924709, 1775924709, NULL, 0);
INSERT INTO `models` VALUES (75, 'jimeng-4.1', '', '', '', 10, '', 1, 0, 1775924715, 1775924715, NULL, 0);
INSERT INTO `models` VALUES (76, 'jimeng-4.5', '', '', '', 10, '', 1, 0, 1775924722, 1775924722, NULL, 0);
INSERT INTO `models` VALUES (77, 'jimeng-agent', '', '', '', 10, '', 1, 0, 1775924728, 1775924728, '2026-04-11 16:25:34.013', 0);
INSERT INTO `models` VALUES (78, 'jimeng-agent', '', '', '', 10, '', 1, 0, 1775924741, 1775924741, NULL, 0);
INSERT INTO `models` VALUES (79, 'jimeng-video-3.0', '', '', '', 10, '', 1, 0, 1775924750, 1775924750, NULL, 0);
INSERT INTO `models` VALUES (80, 'jimeng-video-3.0-10s', '', '', '', 10, '', 1, 0, 1775924757, 1775924757, NULL, 0);
INSERT INTO `models` VALUES (81, 'jimeng-video-3.0-fast', '', '', '', 10, '', 1, 0, 1775924763, 1775924763, NULL, 0);
INSERT INTO `models` VALUES (82, 'jimeng-video-3.0-fast-10s', '', '', '', 10, '', 1, 0, 1775924770, 1775924770, NULL, 0);
INSERT INTO `models` VALUES (83, 'jimeng-video-3.0-pro', '', '', '', 10, '', 1, 0, 1775924777, 1775924777, NULL, 0);
INSERT INTO `models` VALUES (84, 'jimeng-video-3.0-pro-10s', '', '', '', 10, '', 1, 0, 1775924785, 1775924785, NULL, 0);
INSERT INTO `models` VALUES (85, 'jimeng-video-3.5-pro', '', '', '', 10, '', 1, 0, 1775924791, 1775924791, NULL, 0);
INSERT INTO `models` VALUES (86, 'jimeng-video-3.5-pro-10s', '', '', '', 10, '', 1, 0, 1775924797, 1775924797, NULL, 0);
INSERT INTO `models` VALUES (87, 'jimeng-video-3.5-pro-12s', '', '', '', 10, '', 1, 0, 1775924803, 1775924803, NULL, 0);
INSERT INTO `models` VALUES (88, 'seedream-4.6', '', '', '', 10, '', 1, 0, 1775924809, 1775924809, NULL, 0);
INSERT INTO `models` VALUES (89, 'seedream-5.0', '', '', '', 10, '', 1, 0, 1775924815, 1775924815, NULL, 0);
INSERT INTO `models` VALUES (90, 'gpt-5.4-thinking', '', '', '', 2, '', 1, 0, 1776232963, 1776232963, NULL, 0);
INSERT INTO `models` VALUES (91, 'gemini-2.5-flash', '', '', '', 9, '', 1, 0, 1776578772, 1776578772, NULL, 0);
INSERT INTO `models` VALUES (92, 'gemini-2.5-flash-lite', '', '', '', 9, '', 1, 0, 1776578780, 1776578780, NULL, 0);
INSERT INTO `models` VALUES (93, 'gemini-3-flash', '', '', '', 9, '', 1, 0, 1776578789, 1776578789, NULL, 0);
INSERT INTO `models` VALUES (94, 'gemini-3-flash-preview', '', '', '', 9, '', 1, 0, 1776578796, 1776578796, NULL, 0);
INSERT INTO `models` VALUES (95, 'gemini-3-pro-preview', '', '', '', 9, '', 1, 0, 1776578803, 1776578803, NULL, 0);
INSERT INTO `models` VALUES (96, 'gemini-3.1-flash-lite-preview', '', '', '', 9, '', 1, 0, 1776578809, 1776578809, NULL, 0);
INSERT INTO `models` VALUES (97, 'gemini-3.1-pro', '', '', '', 9, '', 1, 0, 1776578816, 1776578816, NULL, 0);
INSERT INTO `models` VALUES (98, 'gemini-3.1-pro-high', '', '', '', 9, '', 1, 0, 1776578824, 1776578824, NULL, 0);
INSERT INTO `models` VALUES (99, 'gemini-3.1-pro-low', '', '', '', 9, '', 1, 0, 1776578830, 1776578830, NULL, 0);
INSERT INTO `models` VALUES (100, 'gemini-3.1-pro-preview', '', '', '', 9, '', 1, 0, 1776578843, 1776578843, NULL, 0);

-- ----------------------------
-- Table structure for options
-- ----------------------------
DROP TABLE IF EXISTS `options`;
CREATE TABLE `options`  (
  `key` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`key`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of options
-- ----------------------------
INSERT INTO `options` VALUES ('AudioCompletionRatio', '{}');
INSERT INTO `options` VALUES ('AudioRatio', '{}');
INSERT INTO `options` VALUES ('AutoGroups', '[\"default\"]');
INSERT INTO `options` VALUES ('CacheRatio', '{\n  \"claude-haiku-4-5\": 0.1,\n  \"claude-haiku-4-5-thinking\": 0.1,\n  \"claude-opus-4\": 0.1,\n  \"claude-opus-4-1\": 0.1,\n  \"claude-opus-4-1-thinking\": 0.1,\n  \"claude-opus-4-5\": 0.125,\n  \"claude-opus-4-5-thinking\": 0.125,\n  \"claude-opus-4-6\": 0.125,\n  \"claude-opus-4-6-thinking\": 0.125,\n  \"claude-opus-4-thinking\": 0.1,\n  \"claude-sonnet-4\": 0.1,\n  \"claude-sonnet-4-5\": 0.1,\n  \"claude-sonnet-4-5-thinking\": 0.1,\n  \"claude-sonnet-4-6\": 0.1,\n  \"claude-sonnet-4-6-thinking\": 0.1,\n  \"claude-sonnet-4-thinking\": 0.1,\n  \"deepseek-3.1\": 0.54,\n  \"deepseek-3.1-terminus\": 0.112,\n  \"deepseek-3.2\": 0.54,\n  \"deepseek-3.2-thinking\": 0.54,\n  \"gemini-2.5-flash\": 0.1,\n  \"gemini-2.5-flash-lite\": 0.1,\n  \"gemini-2.5-pro\": 0.08,\n  \"gemini-3-flash\": 0.1,\n  \"gemini-3-flash-preview\": 0.1,\n  \"gemini-3-pro\": 0.1,\n  \"gemini-3-pro-high\": 0.1,\n  \"gemini-3-pro-low\": 0.1,\n  \"gemini-3-pro-preview\": 0.1,\n  \"gemini-3.1-flash\": 0.1,\n  \"gemini-3.1-flash-lite-preview\": 0.1,\n  \"gemini-3.1-pro\": 0.1,\n  \"gemini-3.1-pro-high\": 0.1,\n  \"gemini-3.1-pro-low\": 0.1,\n  \"gemini-3.1-pro-preview\": 0.1,\n  \"glm-4.6\": 0.183333333333,\n  \"glm-4.7\": 0.183333333333,\n  \"glm-4.7-flash\": 0.142857142857,\n  \"glm-5\": 0.2,\n  \"glm-5-thinking\": 0.2,\n  \"gpt-5\": 0.1,\n  \"gpt-5-codex\": 0.08,\n  \"gpt-5-codex-mini\": 0.1,\n  \"gpt-5.1\": 0.1,\n  \"gpt-5.1-codex\": 0.1,\n  \"gpt-5.1-codex-max\": 0.1,\n  \"gpt-5.1-codex-mini\": 0.1,\n  \"gpt-5.2\": 0.1,\n  \"gpt-5.2-codex\": 0.1,\n  \"gpt-5.3-codex\": 0.1,\n  \"gpt-5.3-codex-spark\": 0.1,\n  \"gpt-5.4\": 0.1,\n  \"gpt-5.4-mini\": 0.1,\n  \"gpt-5.4-thinking\": 0.1,\n  \"kimi-k2-instruct\": 0.25,\n  \"kimi-k2-instruct-0905\": 0.25,\n  \"kimi-k2-thinking\": 1,\n  \"kimi-k2.5\": 0.166666666667,\n  \"minimax-m2.0\": 0.1,\n  \"minimax-m2.1\": 0.1,\n  \"minimax-m2.1-thinking\": 0.1,\n  \"minimax-m2.5\": 0.1,\n  \"minimax-m2.5-thinking\": 0.1,\n  \"qwen3-coder-480b-a35b-instruct\": 0.1,\n  \"qwen3-coder-next\": 0.05,\n  \"qwen3-coder-next-thinking\": 0.05,\n  \"qwen3-coder-plus\": 0.1,\n  \"qwen3-coder-plus-thinking-search\": 0.1,\n  \"qwen3.5-max\": 0.175438596491,\n  \"qwen3.5-max-thinking-search\": 0.175438596491,\n  \"qwen3.5-plus\": 0.033333333333,\n  \"qwen3.5-plus-thinking-search\": 0.033333333333\n}');
INSERT INTO `options` VALUES ('CompletionRatio', '{\n  \"claude-haiku-4-5\": 5,\n  \"claude-haiku-4-5-thinking\": 5,\n  \"claude-opus-4\": 5,\n  \"claude-opus-4-1\": 5,\n  \"claude-opus-4-1-thinking\": 5,\n  \"claude-opus-4-5\": 5,\n  \"claude-opus-4-5-thinking\": 5,\n  \"claude-opus-4-6\": 5,\n  \"claude-opus-4-6-thinking\": 5,\n  \"claude-opus-4-thinking\": 5,\n  \"claude-sonnet-4\": 5,\n  \"claude-sonnet-4-5\": 5,\n  \"claude-sonnet-4-5-thinking\": 5,\n  \"claude-sonnet-4-6\": 5,\n  \"claude-sonnet-4-6-thinking\": 5,\n  \"claude-sonnet-4-thinking\": 5,\n  \"deepseek-3.1\": 4,\n  \"deepseek-3.1-terminus\": 1.68,\n  \"deepseek-3.2\": 1.8,\n  \"deepseek-3.2-thinking\": 1.8,\n  \"gemini-2.5-flash\": 8.333333333333,\n  \"gemini-2.5-flash-lite\": 4,\n  \"gemini-2.5-pro\": 8,\n  \"gemini-3-flash\": 6,\n  \"gemini-3-flash-preview\": 6,\n  \"gemini-3-pro\": 6,\n  \"gemini-3-pro-high\": 6,\n  \"gemini-3-pro-low\": 6,\n  \"gemini-3-pro-preview\": 6,\n  \"gemini-3.1-flash\": 8.333333333333,\n  \"gemini-3.1-flash-lite\": 6,\n  \"gemini-3.1-flash-lite-preview\": 6,\n  \"gemini-3.1-pro\": 6,\n  \"gemini-3.1-pro-high\": 6,\n  \"gemini-3.1-pro-low\": 6,\n  \"gemini-3.1-pro-preview\": 6,\n  \"glm-4.6\": 3.666666666667,\n  \"glm-4.7\": 3.666666666667,\n  \"glm-4.7-flash\": 5.714285714286,\n  \"glm-5\": 3.2,\n  \"glm-5-thinking\": 3.2,\n  \"gpt-5\": 8,\n  \"gpt-5-codex\": 8,\n  \"gpt-5-codex-mini\": 8,\n  \"gpt-5.1\": 8,\n  \"gpt-5.1-codex\": 8,\n  \"gpt-5.1-codex-max\": 8,\n  \"gpt-5.1-codex-mini\": 8,\n  \"gpt-5.2\": 8,\n  \"gpt-5.2-codex\": 8,\n  \"gpt-5.3-codex\": 8,\n  \"gpt-5.3-codex-spark\": 8,\n  \"gpt-5.4\": 6,\n  \"gpt-5.4-mini\": 6,\n  \"gpt-5.4-thinking\": 6,\n  \"grok-3\": 5,\n  \"grok-3-mini\": 1.666666666667,\n  \"grok-3-thinking\": 5,\n  \"grok-4\": 5,\n  \"grok-4-thinking\": 5,\n  \"grok-4.1-expert\": 5,\n  \"grok-4.1-fast\": 2.5,\n  \"grok-4.1-mini\": 2.5,\n  \"grok-4.1-thinking\": 5,\n  \"grok-4.20-beta\": 3,\n  \"kimi-k2-instruct\": 4.166666666667,\n  \"kimi-k2-instruct-0905\": 4.166666666667,\n  \"kimi-k2-thinking\": 16.666666666667,\n  \"kimi-k2.5\": 5,\n  \"minimax-m2.0\": 4,\n  \"minimax-m2.1\": 4,\n  \"minimax-m2.1-thinking\": 4,\n  \"minimax-m2.5\": 4,\n  \"minimax-m2.5-thinking\": 4,\n  \"qwen3-coder-480b-a35b-instruct\": 4,\n  \"qwen3-coder-next\": 4.25,\n  \"qwen3-coder-next-thinking\": 4.25,\n  \"qwen3-coder-plus\": 2,\n  \"qwen3-coder-plus-thinking-search\": 2,\n  \"qwen3.5-122b-a10b\": 10,\n  \"qwen3.5-122b-a10b-thinking-search\": 10,\n  \"qwen3.5-35b-a3b-thinking-search\": 9,\n  \"qwen3.5-397b-a17b\": 6.25,\n  \"qwen3.5-397b-a17b-thinking-search\": 6.25,\n  \"qwen3.5-flash\": 10,\n  \"qwen3.5-flash-thinking-search\": 10,\n  \"qwen3.5-max\": 2.982456140351,\n  \"qwen3.5-max-thinking-search\": 2.982456140351,\n  \"qwen3.5-plus\": 5.833333333333,\n  \"qwen3.5-plus-thinking-search\": 5.833333333333\n}');
INSERT INTO `options` VALUES ('CreateCacheRatio', '{\n  \"claude-haiku-4-5\": 1.25,\n  \"claude-haiku-4-5-thinking\": 1.25,\n  \"claude-opus-4\": 1,\n  \"claude-opus-4-1\": 1,\n  \"claude-opus-4-1-thinking\": 1,\n  \"claude-opus-4-5\": 1,\n  \"claude-opus-4-5-thinking\": 1,\n  \"claude-opus-4-6\": 1,\n  \"claude-opus-4-6-thinking\": 1,\n  \"claude-opus-4-thinking\": 1,\n  \"claude-sonnet-4\": 1,\n  \"claude-sonnet-4-5\": 1,\n  \"claude-sonnet-4-5-thinking\": 1,\n  \"claude-sonnet-4-6\": 1,\n  \"claude-sonnet-4-6-thinking\": 1,\n  \"claude-sonnet-4-thinking\": 1,\n  \"gemini-2.5-flash\": 3.333333333333,\n  \"gemini-3-flash\": 2,\n  \"gemini-3-pro\": 2.25,\n  \"gemini-3-pro-high\": 2.25,\n  \"gemini-3-pro-low\": 2.25,\n  \"gemini-3.1-flash\": 3.333333333333,\n  \"gemini-3.1-pro\": 2.25,\n  \"gemini-3.1-pro-high\": 2.25,\n  \"gemini-3.1-pro-low\": 2.25,\n  \"minimax-m2.0\": 1.25,\n  \"minimax-m2.1\": 1.25,\n  \"minimax-m2.1-thinking\": 1.25,\n  \"minimax-m2.5\": 1.25,\n  \"minimax-m2.5-thinking\": 1.25,\n  \"qwen3.5-max\": 1.228070175439,\n  \"qwen3.5-max-thinking-search\": 1.228070175439,\n  \"qwen3.5-plus\": 0.333333333333,\n  \"qwen3.5-plus-thinking-search\": 0.333333333333\n}');
INSERT INTO `options` VALUES ('CustomCallbackAddress', 'http://ailink.dog');
INSERT INTO `options` VALUES ('DemoSiteEnabled', 'false');
INSERT INTO `options` VALUES ('DrawingEnabled', 'false');
INSERT INTO `options` VALUES ('EpayId', '1374');
INSERT INTO `options` VALUES ('EpayKey', 'cu81sm315mR99jUmu1CpZDrC8cj8Z1yc');
INSERT INTO `options` VALUES ('Footer', '<style>.text-sm.flex-shrink-0{display: none;}; .custom-footer { background-color: #ffffff; border-top: 1px solid #e5e7eb; padding: 40px 20px; color: #64748b; font-family: -apple-system, system-ui, sans-serif; } .footer-content { max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 30px; } .footer-section { flex: 1; min-width: 200px; } .footer-section h4 { color: #1e293b; margin-bottom: 15px; font-size: 16px; } .footer-links { list-style: none; padding: 0; margin: 0; } .footer-links li { margin-bottom: 8px; } .footer-links a { color: #64748b; text-decoration: none; font-size: 14px; transition: color 0.2s; } .footer-links a:hover { color: #4f46e5; } .footer-bottom { max-width: 1100px; margin: 30px auto 0; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 13px; } .status-dot { display: inline-block; width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; margin-right: 5px; }</style> <footer class=\"custom-footer\">   <div class=\"footer-content\">     <div class=\"footer-section\">       <h4>狗站 AI</h4>       <p style=\"font-size: 14px; line-height: 1.6;\">稳定、快速、安全的 API 聚合转发平台。         <br>助力开发者轻松接入全球顶级 AI 模型。</p></div>     <div class=\"footer-section\">       <h4>常用链接</h4>       <ul class=\"footer-links\">         <li>           <a href=\"/pricing\">价格费率</a></li>       </ul>     </div>     <div class=\"footer-section\">       <h4>法律与条款</h4>       <ul class=\"footer-links\">         <li>           <a href=\"/user-agreement\">用户协议</a></li>         <li>           <a href=\"/privacy-policy\">隐私政策</a></li>       </ul>     </div>     <div class=\"footer-section\">       <h4>服务状态</h4>       <p style=\"font-size: 14px;\">         <span class=\"status-dot\"></span>所有节点正常运行</p>       <p style=\"font-size: 14px;\">Telegram 客服：@JyzCloud</p><p style=\"font-size: 14px;\">微信客服：Dorothy_Raph</p></div>    </div>   <div class=\"footer-bottom\">&copy; 2026 AiLinkDog AI. All Rights Reserved.</div></footer>');
INSERT INTO `options` VALUES ('GroupGroupRatio', '{\n  \"渠道用户\": {\n    \"Claude|反代\": 0.35,\n    \"Gemini|反代\": 0.2,\n    \"Codex|自营\": 0.1\n  }\n}');
INSERT INTO `options` VALUES ('GroupRatio', '{\n  \"Codex|自营\": 0.2,\n  \"DeepSeek|自营\": 0.1,\n  \"Qwen|自营\": 0.1,\n  \"MiniMax|自营\": 0.1,\n  \"ZhiPu|自营\": 0.1,\n  \"Grok|自营\": 0.8,\n  \"Kimi|自营\": 0.1,\n  \"Claude|企业\": 3.5,\n  \"Claude|官转\": 2.5,\n  \"Claude|反代\": 0.45,\n  \"Gemini|多媒体\": 1,\n  \"JiMeng|多媒体\": 1,\n  \"Claude|反代|特价\": 0.35,\n  \"Gemini|反代\": 0.25,\n  \"渠道用户\": 1\n}');
INSERT INTO `options` VALUES ('group_ratio_setting.group_special_usable_group', '');
INSERT INTO `options` VALUES ('HeaderNavModules', '{\"home\":true,\"console\":true,\"pricing\":{\"enabled\":true,\"requireAuth\":false},\"docs\":false,\"about\":false}');
INSERT INTO `options` VALUES ('ImageRatio', '{}');
INSERT INTO `options` VALUES ('legal.privacy_policy', '# 隐私政策 (Privacy Policy)\n\n本平台（以下简称“我们”）深知隐私对您的重要性。本隐私政策旨在说明我们如何处理您在使用 API 中转服务过程中产生的数据。\n\n### 一、 我们收集的信息\n1. **账户信息**：在您注册时，我们可能会收集您的用户名、电子邮箱地址以及登录日志（IP 地址、登录时间）。\n2. **API 调用日志**：为了计费和故障排查，我们会记录调用时间、使用的模型名称、消耗的 Token 数量以及请求状态（成功/失败）。\n3. **充值记录**：记录您的充值金额、时间及支付渠道提供的交易流水号（我们不直接存储您的银行卡信息）。\n\n### 二、 数据处理与传输\n1. **请求内容处理**：作为中转平台，我们仅对您的 API 请求进行协议转换和转发。**我们默认不存储（持久化保存）您的请求 Prompt 和模型返回的回复内容。**\n2. **流式传输**：所有数据均通过加密通道（HTTPS/TLS）进行传输，确保数据在传输过程中的安全性。\n\n### 三、 信息的使用\n我们收集的信息仅用于以下用途：\n* 提供、维护及优化 API 中转服务；\n* 统计您的账户额度消耗并进行准确计费；\n* 识别并阻止恶意攻击、非法内容生成或违规调用；\n* 发送与服务相关的必要通知（如余额不足、系统维护）。\n\n### 四、 第三方披露\n1. **上游服务商**：为了完成您的请求，您的数据将被加密发送至对应的上游服务商（如 OpenAI, Anthropic, Google 等）。这些服务商将根据其自身的隐私政策处理数据。\n2. **法律要求**：在收到执法部门合法的调取指令时，我们可能会依据法律程序披露必要的信息。\n\n### 五、 数据安全\n我们采取行业标准的加密措施和访问控制策略来保护您的数据。但请注意，互联网上的数据传输或电子存储并非 100% 安全，我们无法保证绝对安全性。\n\n### 六、 您的权利\n您可以随时登录控制台查看、修改个人信息或申请注销账户。注销后，我们将根据相关法律法规的要求删除或匿名化处理您的个人数据。\n\n---\n*生效日期：2026年3月11日*');
INSERT INTO `options` VALUES ('legal.user_agreement', '# 用户服务协议 (Terms of Service)\n\n欢迎使用本 API 中转服务平台（以下简称“本平台”）。在注册、登录或使用本平台提供的服务前，请您务必审阅并同意本协议。\n\n### 一、 服务内容\n1. 本平台仅作为技术中转中介，提供对上游大模型（如 OpenAI, Claude, Google Gemini 等）接口的访问加速与聚合管理。\n2. 具体的可用模型、调用价格及倍率以平台「控制台」实时显示为准。\n\n### 二、 账户使用规范\n1. **安全性**：用户须妥善保管 API Key。因用户泄露 Key 导致的额度损失，本平台不予补偿。\n2. **严禁行为**：\n    * 严禁将本服务用于非法用途（包括但不限于色情、暴力、政治敏感等违反法律法规的内容）。\n    * 严禁利用平台漏洞进行恶意刷取额度、攻击接口等行为。\n    * 严禁在未经许可的情况下对本平台接口进行二次大规模分销。\n\n### 三、 计费与退款\n1. **计费模式**：平台采用预付充值制，按实际调用消耗的 Token 数（结合倍率）扣除。\n2. **退款政策**：由于虚拟商品服务的特殊性，一旦充值成功并产生消耗，原则上不接受退款。若因平台永久停止服务，将按剩余额度比例退回余额。\n\n### 四、 免责声明\n1. **服务稳定性**：本平台依赖上游供应商的稳定性，不对由于上游宕机、网络封锁、政策变动等不可抗力因素导致的服务中断承担责任。\n2. **数据隐私**：本平台仅传输请求数据，不存储用户的提问内容与模型回复，但建议用户不要传输敏感个人信息。\n3. **内容责任**：用户需对通过本平台生成的内容承担全部法律责任。\n\n### 五、 协议变更\n本平台保留随时修改本协议的权利。协议更新后，用户继续使用服务即视为接受新协议。\n\n---\n*更新日期：2026年3月11日*');
INSERT INTO `options` VALUES ('MinTopUp', '20');
INSERT INTO `options` VALUES ('MjForwardUrlEnabled', 'true');
INSERT INTO `options` VALUES ('ModelPrice', '{\n  \"dance2-fast-10s\": 4,\n  \"dance2-fast-15s\": 6,\n  \"dance2-fast-5s\": 2,\n  \"gemini-3.1-flash-image\": 0.15,\n  \"gemini-3.1-flash-image-preview\": 0.15,\n  \"jimeng-3.0\": 0.04,\n  \"jimeng-3.1\": 0.04,\n  \"jimeng-4.0\": 0.04,\n  \"jimeng-4.1\": 0.04,\n  \"jimeng-4.5\": 0.04,\n  \"jimeng-video-3.0\": 0.15,\n  \"jimeng-video-3.0-10s\": 0.15,\n  \"jimeng-video-3.0-fast\": 0.15,\n  \"jimeng-video-3.0-fast-10s\": 0.15,\n  \"jimeng-video-3.0-pro\": 0.2,\n  \"jimeng-video-3.0-pro-10s\": 0.3,\n  \"jimeng-video-3.5-pro\": 0.3,\n  \"jimeng-video-3.5-pro-10s\": 0.5,\n  \"jimeng-video-3.5-pro-12s\": 0.8,\n  \"nano-banana\": 0.05,\n  \"seedream-4.6\": 0.05,\n  \"seedream-5.0\": 0.05\n}');
INSERT INTO `options` VALUES ('ModelRatio', '{\n  \"claude-haiku-4-5\": 0.5,\n  \"claude-haiku-4-5-thinking\": 0.5,\n  \"claude-opus-4\": 7.5,\n  \"claude-opus-4-1\": 7.5,\n  \"claude-opus-4-1-thinking\": 7.5,\n  \"claude-opus-4-5\": 2.5,\n  \"claude-opus-4-5-thinking\": 2.5,\n  \"claude-opus-4-6\": 2.5,\n  \"claude-opus-4-6-thinking\": 2.5,\n  \"claude-opus-4-thinking\": 7.5,\n  \"claude-sonnet-4\": 1.5,\n  \"claude-sonnet-4-5\": 1.5,\n  \"claude-sonnet-4-5-thinking\": 1.5,\n  \"claude-sonnet-4-6\": 1.5,\n  \"claude-sonnet-4-6-thinking\": 1.5,\n  \"claude-sonnet-4-thinking\": 1.5,\n  \"deepseek-3.1\": 0.125,\n  \"deepseek-3.1-terminus\": 0.125,\n  \"deepseek-3.2\": 0.125,\n  \"deepseek-3.2-thinking\": 0.125,\n  \"gemini-2.5-flash\": 0.15,\n  \"gemini-2.5-flash-lite\": 0.05,\n  \"gemini-2.5-pro\": 0.625,\n  \"gemini-3-flash\": 0.25,\n  \"gemini-3-flash-preview\": 0.25,\n  \"gemini-3-pro\": 1,\n  \"gemini-3-pro-high\": 1,\n  \"gemini-3-pro-low\": 1,\n  \"gemini-3-pro-preview\": 1,\n  \"gemini-3.1-flash\": 0.15,\n  \"gemini-3.1-flash-lite\": 0.125,\n  \"gemini-3.1-flash-lite-preview\": 0.125,\n  \"gemini-3.1-pro\": 1,\n  \"gemini-3.1-pro-high\": 1,\n  \"gemini-3.1-pro-low\": 1,\n  \"gemini-3.1-pro-preview\": 1,\n  \"glm-4.6\": 0.3,\n  \"glm-4.7\": 0.3,\n  \"glm-4.7-flash\": 0.035,\n  \"glm-5\": 0.5,\n  \"glm-5-thinking\": 0.5,\n  \"gpt-5\": 0.625,\n  \"gpt-5-codex\": 0.625,\n  \"gpt-5-codex-mini\": 0.125,\n  \"gpt-5.1\": 0.625,\n  \"gpt-5.1-codex\": 0.625,\n  \"gpt-5.1-codex-max\": 0.625,\n  \"gpt-5.1-codex-mini\": 0.125,\n  \"gpt-5.2\": 0.875,\n  \"gpt-5.2-codex\": 0.875,\n  \"gpt-5.3-codex\": 0.875,\n  \"gpt-5.3-codex-spark\": 0.875,\n  \"gpt-5.4\": 1.25,\n  \"gpt-5.4-mini\": 0.375,\n  \"gpt-5.4-thinking\": 1.25,\n  \"grok-3\": 1.5,\n  \"grok-3-mini\": 0.15,\n  \"grok-3-thinking\": 1.5,\n  \"grok-4\": 1.5,\n  \"grok-4-thinking\": 1.5,\n  \"grok-4.1-expert\": 0.5,\n  \"grok-4.1-fast\": 0.1,\n  \"grok-4.1-mini\": 0.1,\n  \"grok-4.1-thinking\": 0.5,\n  \"grok-4.20-beta\": 1,\n  \"kimi-k2-instruct\": 0.3,\n  \"kimi-k2-instruct-0905\": 0.3,\n  \"kimi-k2-thinking\": 0.075,\n  \"kimi-k2.5\": 0.3,\n  \"minimax-m2.0\": 0.15,\n  \"minimax-m2.1\": 0.15,\n  \"minimax-m2.1-thinking\": 0.15,\n  \"minimax-m2.5\": 0.15,\n  \"minimax-m2.5-thinking\": 0.15,\n  \"qwen3-coder-480b-a35b-instruct\": 0.625,\n  \"qwen3-coder-next\": 0.1,\n  \"qwen3-coder-next-thinking\": 0.1,\n  \"qwen3-coder-plus\": 0.5,\n  \"qwen3-coder-plus-thinking-search\": 0.5,\n  \"qwen3.5-122b-a10b\": 0.05,\n  \"qwen3.5-122b-a10b-thinking-search\": 0.05,\n  \"qwen3.5-35b-a3b-thinking-search\": 0.025,\n  \"qwen3.5-397b-a17b\": 0.2,\n  \"qwen3.5-397b-a17b-thinking-search\": 0.2,\n  \"qwen3.5-flash\": 0.075,\n  \"qwen3.5-flash-thinking-search\": 0.075,\n  \"qwen3.5-max\": 1.425,\n  \"qwen3.5-max-thinking-search\": 1.425,\n  \"qwen3.5-plus\": 0.15,\n  \"qwen3.5-plus-thinking-search\": 0.15\n}');
INSERT INTO `options` VALUES ('PayAddress', 'https://www.jiangcen.cn');
INSERT INTO `options` VALUES ('payment_setting.amount_options', '[\n  20,\n  50,\n  100,\n  200,\n  500\n]');
INSERT INTO `options` VALUES ('PayMethods', '[{\"color\":\"rgba(var(--semi-green-5), 1)\",\"name\":\"微信\",\"type\":\"wxpay\"}]');
INSERT INTO `options` VALUES ('Price', '1');
INSERT INTO `options` VALUES ('SelfUseModeEnabled', 'false');
INSERT INTO `options` VALUES ('SensitiveWords', '');
INSERT INTO `options` VALUES ('ServerAddress', 'http://ailink.dog');
INSERT INTO `options` VALUES ('SidebarModulesAdmin', '{\"chat\":{\"enabled\":false,\"playground\":false,\"chat\":true},\"console\":{\"enabled\":true,\"detail\":true,\"token\":true,\"log\":true,\"midjourney\":false,\"task\":false},\"personal\":{\"enabled\":true,\"topup\":true,\"personal\":true},\"admin\":{\"enabled\":true,\"channel\":true,\"models\":true,\"deployment\":false,\"redemption\":true,\"user\":true,\"subscription\":true,\"setting\":true}}');
INSERT INTO `options` VALUES ('StripeApiSecret', '27125zhu');
INSERT INTO `options` VALUES ('StripeMinTopUp', '1');
INSERT INTO `options` VALUES ('StripeUnitPrice', '8');
INSERT INTO `options` VALUES ('StripeWebhookSecret', '27125zhu');
INSERT INTO `options` VALUES ('SystemName', 'AiLinkDog');
INSERT INTO `options` VALUES ('UserUsableGroups', '{\n  \"Codex|自营\": \"OpenAI 自营\",\n  \"DeepSeek|自营\": \"DeepSeek 自营\",\n  \"Qwen|自营\": \"Qwen 自营 \",\n  \"MiniMax|自营\": \"MinMax 自营\",\n  \"ZhiPu|自营\": \"ZhiPu 自营\",\n  \"Grok|自营\": \"Grok 自营\",\n  \"Kimi|自营\": \"Kimi 自营\",\n  \"Claude|企业\": \"Claude 企业渠道\",\n  \"Claude|官转\": \"Claude 官转渠道\",\n  \"Claude|反代\": \"Claude 反代渠道\",\n  \"Gemini|多媒体\": \"Gemini 多媒体\",\n  \"JiMeng|多媒体\": \"JiMeng 多媒体\",\n  \"Claude|反代|特价\": \"Claude 反代 特价 \",\n  \"Gemini|反代\": \"Gemini 反代渠道\",\n  \"渠道用户\": \"渠道用户\"\n}');

-- ----------------------------
-- Table structure for passkey_credentials
-- ----------------------------
DROP TABLE IF EXISTS `passkey_credentials`;
CREATE TABLE `passkey_credentials`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `credential_id` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `public_key` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `attestation_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `aa_guid` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `sign_count` int UNSIGNED NULL DEFAULT 0,
  `clone_warning` tinyint(1) NULL DEFAULT NULL,
  `user_present` tinyint(1) NULL DEFAULT NULL,
  `user_verified` tinyint(1) NULL DEFAULT NULL,
  `backup_eligible` tinyint(1) NULL DEFAULT NULL,
  `backup_state` tinyint(1) NULL DEFAULT NULL,
  `transports` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `attachment` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `last_used_at` datetime(3) NULL DEFAULT NULL,
  `created_at` datetime(3) NULL DEFAULT NULL,
  `updated_at` datetime(3) NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_passkey_credentials_user_id`(`user_id` ASC) USING BTREE,
  UNIQUE INDEX `idx_passkey_credentials_credential_id`(`credential_id` ASC) USING BTREE,
  INDEX `idx_passkey_credentials_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of passkey_credentials
-- ----------------------------

-- ----------------------------
-- Table structure for prefill_groups
-- ----------------------------
DROP TABLE IF EXISTS `prefill_groups`;
CREATE TABLE `prefill_groups`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `items` json NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_time` bigint NULL DEFAULT NULL,
  `updated_time` bigint NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_prefill_name`(`name` ASC) USING BTREE,
  INDEX `idx_prefill_groups_type`(`type` ASC) USING BTREE,
  INDEX `idx_prefill_groups_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of prefill_groups
-- ----------------------------

-- ----------------------------
-- Table structure for quota_data
-- ----------------------------
DROP TABLE IF EXISTS `quota_data`;
CREATE TABLE `quota_data`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL,
  `username` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `model_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `created_at` bigint NULL DEFAULT NULL,
  `token_used` bigint NULL DEFAULT 0,
  `count` bigint NULL DEFAULT 0,
  `quota` bigint NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_quota_data_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_qdt_model_user_name`(`model_name` ASC, `username` ASC) USING BTREE,
  INDEX `idx_qdt_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1141 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of quota_data
-- ----------------------------
INSERT INTO `quota_data` VALUES (1, 1, '532570043', 'gpt-5.3-codex', 1775829600, 22, 1, 111);
INSERT INTO `quota_data` VALUES (2, 1, '532570043', 'gpt-5-codex-mini', 1775829600, 29, 1, 23);
INSERT INTO `quota_data` VALUES (3, 1, '532570043', 'gpt-5-codex', 1775829600, 37, 1, 154);
INSERT INTO `quota_data` VALUES (4, 1, '532570043', 'gpt-5.1-codex-mini', 1775829600, 32, 1, 26);
INSERT INTO `quota_data` VALUES (5, 1, '532570043', 'gpt-5.2', 1775829600, 21, 1, 104);
INSERT INTO `quota_data` VALUES (6, 1, '532570043', 'gpt-5.1', 1775829600, 45, 1, 194);
INSERT INTO `quota_data` VALUES (7, 1, '532570043', 'gpt-5.4', 1775829600, 18, 1, 91);
INSERT INTO `quota_data` VALUES (8, 1, '532570043', 'gpt-5.4-mini', 1775829600, 35, 1, 66);
INSERT INTO `quota_data` VALUES (9, 1, '532570043', 'gpt-5.1-codex', 1775829600, 26, 1, 99);
INSERT INTO `quota_data` VALUES (10, 1, '532570043', 'gpt-5', 1775829600, 111, 1, 524);
INSERT INTO `quota_data` VALUES (11, 1, '532570043', 'gpt-5.2-codex', 1775829600, 31, 1, 174);
INSERT INTO `quota_data` VALUES (12, 1, '532570043', 'gpt-5.1-codex-max', 1775829600, 44, 1, 189);
INSERT INTO `quota_data` VALUES (13, 1, '532570043', 'deepseek-3.2', 1775829600, 15, 1, 3);
INSERT INTO `quota_data` VALUES (14, 1, '532570043', 'deepseek-3.2-thinking', 1775829600, 111, 1, 25);
INSERT INTO `quota_data` VALUES (15, 1, '532570043', 'qwen3.5-max-thinking-search', 1775829600, 287, 2, 1174);
INSERT INTO `quota_data` VALUES (16, 1, '532570043', 'qwen3.5-plus-thinking-search', 1775829600, 165, 2, 133);
INSERT INTO `quota_data` VALUES (17, 1, '532570043', 'qwen3.5-397b-a17b', 1775829600, 34, 2, 26);
INSERT INTO `quota_data` VALUES (18, 1, '532570043', 'qwen3.5-397b-a17b-thinking-search', 1775829600, 169, 2, 195);
INSERT INTO `quota_data` VALUES (19, 1, '532570043', 'qwen3.5-122b-a10b-thinking-search', 1775829600, 172, 2, 78);
INSERT INTO `quota_data` VALUES (20, 1, '532570043', 'qwen3-coder-plus', 1775829600, 63, 2, 55);
INSERT INTO `quota_data` VALUES (21, 1, '532570043', 'qwen3.5-flash-thinking-search', 1775829600, 189, 2, 131);
INSERT INTO `quota_data` VALUES (22, 1, '532570043', 'qwen3.5-plus', 1775829600, 34, 2, 18);
INSERT INTO `quota_data` VALUES (23, 1, '532570043', 'qwen3.5-flash', 1775829600, 34, 2, 14);
INSERT INTO `quota_data` VALUES (24, 1, '532570043', 'qwen3.5-122b-a10b', 1775829600, 34, 2, 10);
INSERT INTO `quota_data` VALUES (25, 1, '532570043', 'qwen3.5-max', 1775829600, 36, 2, 108);
INSERT INTO `quota_data` VALUES (26, 1, '532570043', 'qwen3-coder-plus-thinking-search', 1775829600, 304, 2, 296);
INSERT INTO `quota_data` VALUES (27, 1, '532570043', 'qwen3-coder-next', 1775833200, 15, 1, 43);
INSERT INTO `quota_data` VALUES (28, 1, '532570043', 'qwen3-coder-next-thinking', 1775833200, 128, 1, 382);
INSERT INTO `quota_data` VALUES (29, 1, '532570043', 'minimax-m2.5', 1775833200, 70, 2, 24);
INSERT INTO `quota_data` VALUES (30, 1, '532570043', 'minimax-m2.1', 1775833200, 15, 1, 9);
INSERT INTO `quota_data` VALUES (31, 1, '532570043', 'minimax-m2.5-thinking', 1775833200, 129, 1, 77);
INSERT INTO `quota_data` VALUES (32, 1, '532570043', 'minimax-m2.1-thinking', 1775833200, 128, 1, 76);
INSERT INTO `quota_data` VALUES (33, 1, '532570043', 'grok-4.1-thinking', 1775833200, 20, 1, 40);
INSERT INTO `quota_data` VALUES (34, 1, '532570043', 'glm-5', 1775833200, 15, 1, 23);
INSERT INTO `quota_data` VALUES (35, 1, '532570043', 'grok-4', 1775833200, 13, 1, 68);
INSERT INTO `quota_data` VALUES (36, 1, '532570043', 'grok-3-mini', 1775833200, 11, 1, 2);
INSERT INTO `quota_data` VALUES (37, 1, '532570043', 'grok-3-thinking', 1775833200, 13, 1, 68);
INSERT INTO `quota_data` VALUES (38, 1, '532570043', 'grok-3', 1775833200, 12, 1, 60);
INSERT INTO `quota_data` VALUES (39, 1, '532570043', 'grok-4.1-mini', 1775833200, 11, 1, 2);
INSERT INTO `quota_data` VALUES (40, 1, '532570043', 'grok-4.20-beta', 1775833200, 11, 1, 23);
INSERT INTO `quota_data` VALUES (41, 1, '532570043', 'glm-5-thinking', 1775833200, 129, 1, 206);
INSERT INTO `quota_data` VALUES (42, 1, '532570043', 'grok-4-thinking', 1775833200, 11, 1, 53);
INSERT INTO `quota_data` VALUES (43, 1, '532570043', 'grok-4.1-fast', 1775833200, 12, 1, 2);
INSERT INTO `quota_data` VALUES (44, 1, '532570043', 'kimi-k2-instruct-0905', 1775833200, 37, 1, 22);
INSERT INTO `quota_data` VALUES (45, 1, '532570043', 'kimi-k2-instruct', 1775833200, 27, 1, 18);
INSERT INTO `quota_data` VALUES (46, 1, '532570043', 'kimi-k2.5', 1775833200, 25, 1, 27);
INSERT INTO `quota_data` VALUES (47, 1, '532570043', 'kimi-k2-thinking', 1775833200, 58, 1, 63);
INSERT INTO `quota_data` VALUES (48, 1, '532570043', 'deepseek-3.1', 1775833200, 19, 1, 7);
INSERT INTO `quota_data` VALUES (49, 1, '532570043', 'deepseek-3.1-terminus', 1775833200, 23, 1, 4);
INSERT INTO `quota_data` VALUES (50, 1, '532570043', 'deepseek-3.2', 1775833200, 21, 1, 4);
INSERT INTO `quota_data` VALUES (51, 1, '532570043', 'qwen3.5-122b-a10b', 1775836800, 23, 1, 6);
INSERT INTO `quota_data` VALUES (52, 1, '532570043', 'qwen3-coder-480b-a35b-instruct', 1775836800, 19, 1, 31);
INSERT INTO `quota_data` VALUES (53, 1, '532570043', 'qwen3.5-397b-a17b', 1775836800, 23, 1, 15);
INSERT INTO `quota_data` VALUES (54, 1, '532570043', 'claude-opus-4-6', 1775836800, 170, 2, 1696);
INSERT INTO `quota_data` VALUES (55, 1, '532570043', 'claude-opus-4-5', 1775836800, 38, 1, 255);
INSERT INTO `quota_data` VALUES (56, 1, '532570043', 'claude-sonnet-4-thinking', 1775836800, 169, 1, 956);
INSERT INTO `quota_data` VALUES (57, 1, '532570043', 'claude-sonnet-4-6', 1775836800, 35, 1, 125);
INSERT INTO `quota_data` VALUES (58, 1, '532570043', 'claude-haiku-4-5', 1775836800, 38, 1, 51);
INSERT INTO `quota_data` VALUES (59, 1, '532570043', 'claude-opus-4-1', 1775836800, 38, 1, 765);
INSERT INTO `quota_data` VALUES (60, 1, '532570043', 'claude-opus-4', 1775836800, 38, 1, 765);
INSERT INTO `quota_data` VALUES (61, 1, '532570043', 'claude-opus-4-1-thinking', 1775836800, 187, 1, 5453);
INSERT INTO `quota_data` VALUES (62, 1, '532570043', 'claude-opus-4-5-thinking', 1775836800, 162, 1, 1505);
INSERT INTO `quota_data` VALUES (63, 1, '532570043', 'claude-sonnet-4', 1775836800, 38, 1, 153);
INSERT INTO `quota_data` VALUES (64, 1, '532570043', 'claude-sonnet-4-5', 1775836800, 38, 1, 153);
INSERT INTO `quota_data` VALUES (65, 1, '532570043', 'claude-opus-4-thinking', 1775836800, 294, 1, 3155);
INSERT INTO `quota_data` VALUES (66, 1, '532570043', 'claude-haiku-4-5-thinking', 1775836800, 236, 1, 486);
INSERT INTO `quota_data` VALUES (67, 1, '532570043', 'claude-sonnet-4', 1775840400, 120, 5, 660);
INSERT INTO `quota_data` VALUES (68, 1, '532570043', 'claude-sonnet-4-6-thinking', 1775840400, 216, 3, 954);
INSERT INTO `quota_data` VALUES (69, 1, '532570043', 'claude-opus-4-1', 1775840400, 40, 2, 1020);
INSERT INTO `quota_data` VALUES (70, 1, '532570043', 'claude-opus-4-5', 1775840400, 87, 4, 769);
INSERT INTO `quota_data` VALUES (71, 1, '532570043', 'claude-sonnet-4-6', 1775840400, 168, 7, 924);
INSERT INTO `quota_data` VALUES (72, 1, '532570043', 'claude-sonnet-4-thinking', 1775840400, 204, 2, 1087);
INSERT INTO `quota_data` VALUES (73, 1, '532570043', 'claude-sonnet-4-5-thinking', 1775840400, 244, 3, 1165);
INSERT INTO `quota_data` VALUES (74, 1, '532570043', 'claude-opus-4-6', 1775840400, 120, 5, 1100);
INSERT INTO `quota_data` VALUES (75, 1, '532570043', 'claude-sonnet-4-5', 1775840400, 100, 5, 510);
INSERT INTO `quota_data` VALUES (76, 1, '532570043', 'claude-opus-4-5', 1775872800, 828, 2, 2390);
INSERT INTO `quota_data` VALUES (77, 1, '532570043', 'claude-opus-4-6', 1775872800, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (78, 1, '532570043', 'claude-sonnet-4-6', 1775872800, 416, 1, 720);
INSERT INTO `quota_data` VALUES (79, 1, '532570043', 'claude-opus-4-6-thinking', 1775872800, 497, 1, 1943);
INSERT INTO `quota_data` VALUES (80, 1, '532570043', 'claude-opus-4-6-thinking', 1775876400, 1670714, 86, 2648250);
INSERT INTO `quota_data` VALUES (81, 1, '532570043', 'claude-opus-4-6', 1775876400, 728332, 35, 1753647);
INSERT INTO `quota_data` VALUES (82, 1, '532570043', 'claude-opus-4-6-thinking', 1775880000, 5028784, 140, 7272719);
INSERT INTO `quota_data` VALUES (83, 1, '532570043', 'claude-opus-4-6', 1775880000, 526312, 7, 748725);
INSERT INTO `quota_data` VALUES (84, 2, 'yangshuo1281', 'glm-5', 1775880000, 1437611, 32, 74854);
INSERT INTO `quota_data` VALUES (85, 1, '532570043', 'claude-opus-4-6-thinking', 1775883600, 4312972, 59, 5315300);
INSERT INTO `quota_data` VALUES (86, 2, 'yangshuo1281', 'glm-5', 1775883600, 6645545, 111, 338482);
INSERT INTO `quota_data` VALUES (87, 2, 'yangshuo1281', 'glm-5', 1775887200, 3935343, 60, 199485);
INSERT INTO `quota_data` VALUES (88, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775887200, 118927, 5, 139054);
INSERT INTO `quota_data` VALUES (89, 3, 'al90slj23@gmail.com', 'claude-sonnet-4-6', 1775887200, 617573, 23, 425117);
INSERT INTO `quota_data` VALUES (90, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775887200, 61057, 5, 8818);
INSERT INTO `quota_data` VALUES (91, 2, 'yangshuo1281', 'glm-5', 1775890800, 818420, 32, 42196);
INSERT INTO `quota_data` VALUES (92, 1, '532570043', 'claude-opus-4-6-thinking', 1775890800, 8670654, 264, 11415128);
INSERT INTO `quota_data` VALUES (93, 1, '532570043', 'claude-opus-4-6-thinking', 1775894400, 2845401, 29, 3531586);
INSERT INTO `quota_data` VALUES (94, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775894400, 62175, 2, 8696);
INSERT INTO `quota_data` VALUES (95, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775898000, 125713, 4, 17553);
INSERT INTO `quota_data` VALUES (96, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775901600, 63545, 2, 8857);
INSERT INTO `quota_data` VALUES (97, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775905200, 16279, 1, 4310);
INSERT INTO `quota_data` VALUES (98, 3, 'al90slj23@gmail.com', 'claude-sonnet-4-6', 1775905200, 344918, 10, 236020);
INSERT INTO `quota_data` VALUES (99, 1, '532570043', 'claude-opus-4-6-thinking', 1775905200, 5470208, 70, 6669156);
INSERT INTO `quota_data` VALUES (100, 1, '532570043', 'claude-opus-4-6-thinking', 1775908800, 13630005, 232, 17493931);
INSERT INTO `quota_data` VALUES (101, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775908800, 196384, 8, 22755);
INSERT INTO `quota_data` VALUES (102, 1, '532570043', 'claude-opus-4-6-thinking', 1775912400, 13031345, 171, 16530986);
INSERT INTO `quota_data` VALUES (103, 4, 'RaphaelLcs', 'claude-opus-4-5', 1775912400, 35561, 4, 40478);
INSERT INTO `quota_data` VALUES (104, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775912400, 131215, 4, 18334);
INSERT INTO `quota_data` VALUES (105, 4, 'RaphaelLcs', 'claude-opus-4-6', 1775912400, 9829240, 75, 11157852);
INSERT INTO `quota_data` VALUES (106, 1, '532570043', 'claude-opus-4-6', 1775912400, 1027, 2, 3438);
INSERT INTO `quota_data` VALUES (107, 1, '532570043', 'claude-sonnet-4-6', 1775912400, 1038, 2, 2133);
INSERT INTO `quota_data` VALUES (108, 2, 'yangshuo1281', 'glm-5', 1775912400, 12669, 2, 650);
INSERT INTO `quota_data` VALUES (109, 1, '532570043', 'claude-opus-4-5', 1775912400, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (110, 1, '532570043', 'claude-opus-4-6-thinking', 1775916000, 7264419, 142, 9206701);
INSERT INTO `quota_data` VALUES (111, 4, 'RaphaelLcs', 'claude-opus-4-6', 1775916000, 17536470, 172, 19956040);
INSERT INTO `quota_data` VALUES (112, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775916000, 99673, 3, 17672);
INSERT INTO `quota_data` VALUES (113, 2, 'yangshuo1281', 'glm-5', 1775916000, 168139, 13, 8583);
INSERT INTO `quota_data` VALUES (114, 2, 'yangshuo1281', 'glm-5', 1775919600, 348402, 15, 17692);
INSERT INTO `quota_data` VALUES (115, 1, '532570043', 'claude-opus-4-6-thinking', 1775919600, 4699663, 69, 6060044);
INSERT INTO `quota_data` VALUES (116, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775919600, 134429, 4, 18745);
INSERT INTO `quota_data` VALUES (117, 4, 'RaphaelLcs', 'claude-opus-4-6', 1775919600, 1098450, 8, 1239334);
INSERT INTO `quota_data` VALUES (118, 4, 'RaphaelLcs', 'claude-opus-4-6-thinking', 1775919600, 1261237, 9, 1424377);
INSERT INTO `quota_data` VALUES (119, 1, '532570043', 'nano-banana', 1775919600, 2, 1, 25000);
INSERT INTO `quota_data` VALUES (120, 1, '532570043', 'claude-opus-4-6-thinking', 1775923200, 5189291, 52, 6328908);
INSERT INTO `quota_data` VALUES (121, 2, 'yangshuo1281', 'glm-5', 1775923200, 118618, 13, 6402);
INSERT INTO `quota_data` VALUES (122, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775923200, 136265, 4, 18997);
INSERT INTO `quota_data` VALUES (123, 1, '532570043', 'claude-opus-4-6-thinking', 1775926800, 8124820, 81, 10291425);
INSERT INTO `quota_data` VALUES (124, 3, 'al90slj23@gmail.com', 'claude-sonnet-4-6', 1775926800, 1827042, 40, 1188554);
INSERT INTO `quota_data` VALUES (125, 2, 'yangshuo1281', 'glm-5', 1775926800, 156759, 13, 9371);
INSERT INTO `quota_data` VALUES (126, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775926800, 138114, 4, 19270);
INSERT INTO `quota_data` VALUES (127, 2, 'yangshuo1281', 'gpt-5.4', 1775926800, 1666811, 48, 195900);
INSERT INTO `quota_data` VALUES (128, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1775926800, 494, 1, 857);
INSERT INTO `quota_data` VALUES (129, 6, '1575376866@qq.com', 'claude-sonnet-4-6', 1775926800, 9793, 1, 11729);
INSERT INTO `quota_data` VALUES (130, 2, 'yangshuo1281', 'gpt-5.4', 1775930400, 3951426, 60, 249573);
INSERT INTO `quota_data` VALUES (131, 1, '532570043', 'claude-opus-4-6-thinking', 1775930400, 5836967, 97, 7713910);
INSERT INTO `quota_data` VALUES (132, 2, 'yangshuo1281', 'glm-5', 1775930400, 168044, 3, 9589);
INSERT INTO `quota_data` VALUES (133, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775930400, 104768, 3, 18478);
INSERT INTO `quota_data` VALUES (134, 6, '1575376866@qq.com', 'claude-sonnet-4-6', 1775930400, 25065, 1, 19867);
INSERT INTO `quota_data` VALUES (135, 4, 'RaphaelLcs', 'claude-opus-4-6-thinking', 1775930400, 3708531, 25, 4201697);
INSERT INTO `quota_data` VALUES (136, 1, '532570043', 'claude-opus-4-6-thinking', 1775934000, 3735056, 45, 4692373);
INSERT INTO `quota_data` VALUES (137, 4, 'RaphaelLcs', 'claude-opus-4-6-thinking', 1775934000, 4367233, 27, 4941750);
INSERT INTO `quota_data` VALUES (138, 2, 'yangshuo1281', 'gpt-5.4', 1775934000, 1599339, 21, 117396);
INSERT INTO `quota_data` VALUES (139, 3, 'al90slj23@gmail.com', 'claude-sonnet-4-6', 1775934000, 1125910, 46, 582796);
INSERT INTO `quota_data` VALUES (140, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775934000, 140885, 4, 19659);
INSERT INTO `quota_data` VALUES (141, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775934000, 1053, 2, 1630);
INSERT INTO `quota_data` VALUES (142, 3, 'al90slj23@gmail.com', 'claude-sonnet-4-6', 1775937600, 1281563, 52, 877033);
INSERT INTO `quota_data` VALUES (143, 2, 'yangshuo1281', 'glm-5', 1775937600, 257436, 18, 14959);
INSERT INTO `quota_data` VALUES (144, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775937600, 142693, 4, 19869);
INSERT INTO `quota_data` VALUES (145, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775937600, 1480661, 71, 1926460);
INSERT INTO `quota_data` VALUES (146, 2, 'yangshuo1281', 'glm-5', 1775941200, 51167, 2, 3034);
INSERT INTO `quota_data` VALUES (147, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775941200, 3996085, 43, 4413732);
INSERT INTO `quota_data` VALUES (148, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1775941200, 44715, 3, 106046);
INSERT INTO `quota_data` VALUES (149, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775941200, 144558, 4, 20165);
INSERT INTO `quota_data` VALUES (150, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775944800, 3051391, 26, 3553783);
INSERT INTO `quota_data` VALUES (151, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775944800, 146397, 4, 20422);
INSERT INTO `quota_data` VALUES (152, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775948400, 148231, 4, 20643);
INSERT INTO `quota_data` VALUES (153, 6, '1575376866@qq.com', 'claude-opus-4-6', 1775948400, 48590, 4, 55655);
INSERT INTO `quota_data` VALUES (154, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775952000, 150067, 4, 20895);
INSERT INTO `quota_data` VALUES (155, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775952000, 393577, 2, 353274);
INSERT INTO `quota_data` VALUES (156, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775955600, 6095671, 33, 5797183);
INSERT INTO `quota_data` VALUES (157, 2, 'yangshuo1281', 'glm-5', 1775955600, 466238, 12, 27793);
INSERT INTO `quota_data` VALUES (158, 2, 'yangshuo1281', 'gpt-5.4', 1775955600, 73371, 6, 7082);
INSERT INTO `quota_data` VALUES (159, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775955600, 151914, 4, 21164);
INSERT INTO `quota_data` VALUES (160, 1, '532570043', 'qwen3-coder-480b-a35b-instruct', 1775955600, 19, 1, 31);
INSERT INTO `quota_data` VALUES (161, 2, 'yangshuo1281', 'glm-5', 1775959200, 942848, 12, 50861);
INSERT INTO `quota_data` VALUES (162, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775959200, 3385075, 18, 3570518);
INSERT INTO `quota_data` VALUES (163, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775959200, 153743, 4, 21405);
INSERT INTO `quota_data` VALUES (164, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775962800, 4400258, 69, 4695888);
INSERT INTO `quota_data` VALUES (165, 2, 'yangshuo1281', 'glm-5', 1775962800, 129693, 2, 6950);
INSERT INTO `quota_data` VALUES (166, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775962800, 155589, 4, 21673);
INSERT INTO `quota_data` VALUES (167, 1, '532570043', 'claude-opus-4-6-thinking', 1775962800, 649060, 4, 410713);
INSERT INTO `quota_data` VALUES (168, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775966400, 15793191, 57, 9811669);
INSERT INTO `quota_data` VALUES (169, 6, '1575376866@qq.com', 'claude-opus-4-6', 1775966400, 3313648, 49, 1616827);
INSERT INTO `quota_data` VALUES (170, 2, 'yangshuo1281', 'glm-5', 1775966400, 389094, 17, 19836);
INSERT INTO `quota_data` VALUES (171, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775966400, 157448, 4, 21932);
INSERT INTO `quota_data` VALUES (172, 4, 'RaphaelLcs', 'claude-opus-4-6-thinking', 1775966400, 3732538, 58, 4282813);
INSERT INTO `quota_data` VALUES (173, 6, '1575376866@qq.com', 'claude-opus-4-6', 1775970000, 4708446, 40, 1858590);
INSERT INTO `quota_data` VALUES (174, 4, 'RaphaelLcs', 'claude-opus-4-6-thinking', 1775970000, 2322630, 55, 2673725);
INSERT INTO `quota_data` VALUES (175, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775970000, 1836625, 5, 1243133);
INSERT INTO `quota_data` VALUES (176, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775970000, 159294, 4, 22227);
INSERT INTO `quota_data` VALUES (177, 2, 'yangshuo1281', 'gpt-5.4', 1775970000, 1028640, 13, 119059);
INSERT INTO `quota_data` VALUES (178, 2, 'yangshuo1281', 'gpt-5.4', 1775973600, 1098908, 14, 104780);
INSERT INTO `quota_data` VALUES (179, 6, '1575376866@qq.com', 'claude-opus-4-6', 1775973600, 5383864, 37, 2130183);
INSERT INTO `quota_data` VALUES (180, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775973600, 161114, 4, 22427);
INSERT INTO `quota_data` VALUES (181, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775973600, 2805805, 7, 1786423);
INSERT INTO `quota_data` VALUES (182, 6, '1575376866@qq.com', 'claude-opus-4-6', 1775977200, 811540, 5, 312944);
INSERT INTO `quota_data` VALUES (183, 2, 'yangshuo1281', 'gpt-5.4', 1775977200, 1931014, 24, 141746);
INSERT INTO `quota_data` VALUES (184, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775977200, 10691979, 25, 6150470);
INSERT INTO `quota_data` VALUES (185, 4, 'RaphaelLcs', 'claude-opus-4-6-thinking', 1775977200, 786, 1, 1276);
INSERT INTO `quota_data` VALUES (186, 2, 'yangshuo1281', 'glm-5', 1775977200, 45673, 5, 2323);
INSERT INTO `quota_data` VALUES (187, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775977200, 162963, 4, 22699);
INSERT INTO `quota_data` VALUES (188, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775980800, 164806, 4, 32149);
INSERT INTO `quota_data` VALUES (189, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775980800, 2053093, 4, 1358461);
INSERT INTO `quota_data` VALUES (190, 3, 'al90slj23@gmail.com', 'claude-opus-4-6', 1775984400, 2394450, 6, 1375567);
INSERT INTO `quota_data` VALUES (191, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1775984400, 124815, 3, 22038);
INSERT INTO `quota_data` VALUES (192, 2, 'yangshuo1281', 'glm-5', 1775984400, 582852, 29, 31229);
INSERT INTO `quota_data` VALUES (193, 2, 'yangshuo1281', 'gpt-5.4', 1775988000, 130637, 10, 10051);
INSERT INTO `quota_data` VALUES (194, 2, 'yangshuo1281', 'glm-5', 1775991600, 39410, 5, 2191);
INSERT INTO `quota_data` VALUES (195, 2, 'yangshuo1281', 'gpt-5.4', 1775998800, 2781131, 39, 150622);
INSERT INTO `quota_data` VALUES (196, 2, 'yangshuo1281', 'glm-5', 1775998800, 27034, 2, 2803);
INSERT INTO `quota_data` VALUES (197, 2, 'yangshuo1281', 'gpt-5.4', 1776002400, 1634021, 20, 95921);
INSERT INTO `quota_data` VALUES (198, 2, 'yangshuo1281', 'glm-5', 1776002400, 27373, 4, 1418);
INSERT INTO `quota_data` VALUES (199, 2, 'yangshuo1281', 'gpt-5.4', 1776006000, 680811, 13, 48266);
INSERT INTO `quota_data` VALUES (200, 2, 'yangshuo1281', 'glm-5', 1776006000, 323913, 13, 18216);
INSERT INTO `quota_data` VALUES (201, 2, 'yangshuo1281', 'glm-5', 1776009600, 12712, 2, 652);
INSERT INTO `quota_data` VALUES (202, 2, 'yangshuo1281', 'gpt-5.4', 1776009600, 456739, 15, 80139);
INSERT INTO `quota_data` VALUES (203, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776013200, 1506979, 15, 1772079);
INSERT INTO `quota_data` VALUES (204, 2, 'yangshuo1281', 'gpt-5.4', 1776013200, 249994, 4, 38938);
INSERT INTO `quota_data` VALUES (205, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776016800, 1297107, 11, 1136524);
INSERT INTO `quota_data` VALUES (206, 2, 'yangshuo1281', 'gpt-5.4', 1776016800, 1276127, 23, 87260);
INSERT INTO `quota_data` VALUES (207, 6, '1575376866@qq.com', 'claude-sonnet-4-6', 1776016800, 141450, 1, 96229);
INSERT INTO `quota_data` VALUES (208, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776024000, 822770, 12, 608409);
INSERT INTO `quota_data` VALUES (209, 11, '383669141@qq.com', 'claude-opus-4-6', 1776031200, 35331, 4, 16777);
INSERT INTO `quota_data` VALUES (210, 11, '383669141@qq.com', 'gpt-5.4', 1776031200, 503219, 16, 40135);
INSERT INTO `quota_data` VALUES (211, 11, '383669141@qq.com', 'gpt-5.4', 1776034800, 611858, 9, 39515);
INSERT INTO `quota_data` VALUES (212, 11, '383669141@qq.com', 'claude-opus-4-6', 1776034800, 17229, 2, 10978);
INSERT INTO `quota_data` VALUES (213, 11, '383669141@qq.com', 'claude-opus-4-6', 1776042000, 4460371, 59, 1860791);
INSERT INTO `quota_data` VALUES (214, 2, 'yangshuo1281', 'glm-5', 1776042000, 2780045, 47, 141020);
INSERT INTO `quota_data` VALUES (215, 5, 'fengpengzhengju1', 'claude-opus-4-6-thinking', 1776042000, 2991, 2, 1982);
INSERT INTO `quota_data` VALUES (216, 2, 'yangshuo1281', 'glm-5', 1776045600, 3744010, 59, 190043);
INSERT INTO `quota_data` VALUES (217, 5, 'fengpengzhengju1', 'claude-opus-4-6-thinking', 1776045600, 2992, 2, 1790);
INSERT INTO `quota_data` VALUES (218, 11, '383669141@qq.com', 'claude-opus-4-6', 1776045600, 7640305, 33, 4229056);
INSERT INTO `quota_data` VALUES (219, 2, 'yangshuo1281', 'glm-5', 1776049200, 4137685, 58, 211251);
INSERT INTO `quota_data` VALUES (220, 2, 'yangshuo1281', 'glm-5', 1776052800, 507349, 8, 26897);
INSERT INTO `quota_data` VALUES (221, 11, '383669141@qq.com', 'claude-opus-4-6', 1776056400, 4846016, 97, 7187717);
INSERT INTO `quota_data` VALUES (222, 2, 'yangshuo1281', 'glm-5', 1776056400, 217109, 16, 11846);
INSERT INTO `quota_data` VALUES (223, 11, '383669141@qq.com', 'claude-opus-4-6', 1776060000, 5026443, 114, 8102407);
INSERT INTO `quota_data` VALUES (224, 2, 'yangshuo1281', 'glm-5', 1776060000, 232919, 6, 12628);
INSERT INTO `quota_data` VALUES (225, 11, '383669141@qq.com', 'claude-opus-4-6', 1776063600, 7924677, 220, 11499820);
INSERT INTO `quota_data` VALUES (226, 2, 'yangshuo1281', 'glm-5', 1776063600, 803138, 30, 43237);
INSERT INTO `quota_data` VALUES (227, 2, 'yangshuo1281', 'glm-5', 1776067200, 149380, 10, 7733);
INSERT INTO `quota_data` VALUES (228, 11, '383669141@qq.com', 'claude-opus-4-6', 1776067200, 315601, 12, 422670);
INSERT INTO `quota_data` VALUES (229, 11, '383669141@qq.com', 'gpt-5.4', 1776074400, 199483, 2, 50191);
INSERT INTO `quota_data` VALUES (230, 11, '383669141@qq.com', 'claude-opus-4-6', 1776074400, 461934, 8, 582578);
INSERT INTO `quota_data` VALUES (231, 11, '383669141@qq.com', 'claude-sonnet-4-6', 1776078000, 8312345, 41, 2048883);
INSERT INTO `quota_data` VALUES (232, 11, '383669141@qq.com', 'claude-opus-4-6', 1776078000, 969340, 43, 1403702);
INSERT INTO `quota_data` VALUES (233, 11, '383669141@qq.com', 'claude-sonnet-4-6', 1776081600, 16170447, 69, 4259707);
INSERT INTO `quota_data` VALUES (234, 2, 'yangshuo1281', 'glm-5', 1776081600, 320953, 11, 18768);
INSERT INTO `quota_data` VALUES (235, 11, '383669141@qq.com', 'claude-opus-4-6', 1776081600, 1225972, 67, 1920455);
INSERT INTO `quota_data` VALUES (236, 11, '383669141@qq.com', 'claude-sonnet-4-6', 1776085200, 2070349, 17, 672407);
INSERT INTO `quota_data` VALUES (237, 11, '383669141@qq.com', 'claude-opus-4-6', 1776085200, 1003009, 19, 1220689);
INSERT INTO `quota_data` VALUES (238, 1, '532570043', 'claude-opus-4-6-thinking', 1776085200, 723838, 24, 315778);
INSERT INTO `quota_data` VALUES (239, 2, 'yangshuo1281', 'glm-5', 1776085200, 12650, 2, 643);
INSERT INTO `quota_data` VALUES (240, 11, '383669141@qq.com', 'claude-opus-4-6', 1776088800, 808181, 18, 979632);
INSERT INTO `quota_data` VALUES (241, 1, '532570043', 'claude-opus-4-6-thinking', 1776088800, 519615, 13, 251570);
INSERT INTO `quota_data` VALUES (242, 2, 'yangshuo1281', 'gpt-5.4', 1776092400, 84289, 6, 11279);
INSERT INTO `quota_data` VALUES (243, 1, '532570043', 'claude-opus-4-6-thinking', 1776092400, 1244456, 36, 625349);
INSERT INTO `quota_data` VALUES (244, 11, '383669141@qq.com', 'claude-opus-4-6', 1776092400, 135365, 1, 164485);
INSERT INTO `quota_data` VALUES (245, 2, 'yangshuo1281', 'glm-5', 1776096000, 370926, 13, 18878);
INSERT INTO `quota_data` VALUES (246, 11, '383669141@qq.com', 'claude-sonnet-4-6', 1776096000, 5656727, 58, 1095216);
INSERT INTO `quota_data` VALUES (247, 11, '383669141@qq.com', 'claude-opus-4-6', 1776096000, 610740, 13, 905503);
INSERT INTO `quota_data` VALUES (248, 11, '383669141@qq.com', 'claude-opus-4-6', 1776099600, 350965, 20, 765970);
INSERT INTO `quota_data` VALUES (249, 11, '383669141@qq.com', 'claude-sonnet-4-6', 1776099600, 1611052, 11, 313115);
INSERT INTO `quota_data` VALUES (250, 11, '383669141@qq.com', 'claude-opus-4-6', 1776103200, 682472, 23, 1186524);
INSERT INTO `quota_data` VALUES (251, 11, '383669141@qq.com', 'claude-sonnet-4-6', 1776103200, 235960, 12, 63469);
INSERT INTO `quota_data` VALUES (252, 1, '532570043', 'claude-opus-4-5', 1776106800, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (253, 1, '532570043', 'claude-sonnet-4-6', 1776106800, 416, 1, 720);
INSERT INTO `quota_data` VALUES (254, 11, '383669141@qq.com', 'claude-opus-4-6', 1776106800, 486809, 41, 1512479);
INSERT INTO `quota_data` VALUES (255, 1, '532570043', 'claude-opus-4-6', 1776106800, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (256, 1, '532570043', 'claude-opus-4-6-thinking', 1776106800, 497, 1, 1943);
INSERT INTO `quota_data` VALUES (257, 11, '383669141@qq.com', 'claude-opus-4-6', 1776124800, 1079912, 23, 1338127);
INSERT INTO `quota_data` VALUES (258, 11, '383669141@qq.com', 'claude-opus-4-6', 1776128400, 46937, 1, 55405);
INSERT INTO `quota_data` VALUES (259, 2, 'yangshuo1281', 'glm-5', 1776128400, 26870, 4, 1458);
INSERT INTO `quota_data` VALUES (260, 2, 'yangshuo1281', 'glm-5', 1776132000, 346787, 3, 18128);
INSERT INTO `quota_data` VALUES (261, 2, 'yangshuo1281', 'gpt-5.4', 1776132000, 1210969, 16, 90522);
INSERT INTO `quota_data` VALUES (262, 11, '383669141@qq.com', 'claude-sonnet-4-6', 1776135600, 894400, 6, 265713);
INSERT INTO `quota_data` VALUES (263, 2, 'yangshuo1281', 'glm-5', 1776135600, 373775, 17, 19474);
INSERT INTO `quota_data` VALUES (264, 11, '383669141@qq.com', 'gpt-5.4', 1776135600, 1835901, 43, 125579);
INSERT INTO `quota_data` VALUES (265, 11, '383669141@qq.com', 'claude-opus-4-6', 1776142800, 849840, 63, 947973);
INSERT INTO `quota_data` VALUES (266, 2, 'yangshuo1281', 'glm-5', 1776142800, 12982, 2, 683);
INSERT INTO `quota_data` VALUES (267, 1, '532570043', 'claude-haiku-4-5', 1776142800, 12, 1, 28);
INSERT INTO `quota_data` VALUES (268, 1, '532570043', 'claude-sonnet-4-thinking', 1776142800, 78, 1, 579);
INSERT INTO `quota_data` VALUES (269, 1, '532570043', 'claude-sonnet-4-5', 1776142800, 15, 1, 107);
INSERT INTO `quota_data` VALUES (270, 1, '532570043', 'claude-haiku-4-5-thinking', 1776142800, 70, 1, 173);
INSERT INTO `quota_data` VALUES (271, 1, '532570043', 'claude-sonnet-4', 1776142800, 84, 1, 624);
INSERT INTO `quota_data` VALUES (272, 1, '532570043', 'claude-sonnet-4-5-thinking', 1776142800, 129, 1, 962);
INSERT INTO `quota_data` VALUES (273, 11, '383669141@qq.com', 'gpt-5.4', 1776146400, 2162935, 14, 191203);
INSERT INTO `quota_data` VALUES (274, 1, '532570043', 'claude-opus-4-6', 1776146400, 72578, 19, 95495);
INSERT INTO `quota_data` VALUES (275, 11, '383669141@qq.com', 'claude-opus-4-6', 1776146400, 1984012, 94, 2764088);
INSERT INTO `quota_data` VALUES (276, 1, '532570043', 'claude-sonnet-4-6', 1776146400, 832, 2, 1044);
INSERT INTO `quota_data` VALUES (277, 1, '532570043', 'claude-opus-4-6-thinking', 1776146400, 496, 1, 1930);
INSERT INTO `quota_data` VALUES (278, 1, '532570043', 'claude-opus-4-5', 1776146400, 828, 2, 1733);
INSERT INTO `quota_data` VALUES (279, 2, 'yangshuo1281', 'glm-5', 1776146400, 124551, 9, 6551);
INSERT INTO `quota_data` VALUES (280, 11, '383669141@qq.com', 'gpt-5.4', 1776150000, 7027343, 37, 775100);
INSERT INTO `quota_data` VALUES (281, 2, 'yangshuo1281', 'glm-5', 1776150000, 22063, 3, 1146);
INSERT INTO `quota_data` VALUES (282, 2, 'yangshuo1281', 'gpt-5.4', 1776150000, 1588781, 20, 213535);
INSERT INTO `quota_data` VALUES (283, 1, '532570043', 'claude-opus-4-6-thinking', 1776150000, 1923889, 20, 2264560);
INSERT INTO `quota_data` VALUES (284, 11, '383669141@qq.com', 'claude-opus-4-6', 1776150000, 201746, 2, 229281);
INSERT INTO `quota_data` VALUES (285, 11, '383669141@qq.com', 'claude-opus-4-6', 1776153600, 318696, 27, 434921);
INSERT INTO `quota_data` VALUES (286, 2, 'yangshuo1281', 'glm-5', 1776153600, 243464, 13, 13045);
INSERT INTO `quota_data` VALUES (287, 11, '383669141@qq.com', 'gpt-5.4', 1776153600, 5068624, 22, 625201);
INSERT INTO `quota_data` VALUES (288, 2, 'yangshuo1281', 'gpt-5.4', 1776153600, 2053845, 29, 328645);
INSERT INTO `quota_data` VALUES (289, 16, 'luolu1182', 'gpt-5.4-mini', 1776153600, 16802, 2, 853);
INSERT INTO `quota_data` VALUES (290, 16, 'luolu1182', 'gpt-5.3-codex', 1776153600, 1243056, 25, 74276);
INSERT INTO `quota_data` VALUES (291, 16, 'luolu1182', 'gpt-5.3-codex', 1776157200, 2500856, 25, 122375);
INSERT INTO `quota_data` VALUES (292, 2, 'yangshuo1281', 'gpt-5.4', 1776157200, 3595571, 72, 392374);
INSERT INTO `quota_data` VALUES (293, 2, 'yangshuo1281', 'glm-5', 1776157200, 155623, 1, 7843);
INSERT INTO `quota_data` VALUES (294, 1, '532570043', 'claude-opus-4-6', 1776157200, 80823, 15, 98393);
INSERT INTO `quota_data` VALUES (295, 1, '532570043', 'claude-sonnet-4-6', 1776157200, 871, 2, 774);
INSERT INTO `quota_data` VALUES (296, 1, '532570043', 'claude-opus-4-6', 1776160800, 122926, 28, 786689);
INSERT INTO `quota_data` VALUES (297, 2, 'yangshuo1281', 'gpt-5.4', 1776160800, 5392729, 85, 393444);
INSERT INTO `quota_data` VALUES (298, 1, '532570043', 'claude-sonnet-4-6', 1776160800, 155, 4, 845);
INSERT INTO `quota_data` VALUES (299, 1, '532570043', 'claude-opus-4', 1776160800, 38, 1, 765);
INSERT INTO `quota_data` VALUES (300, 1, '532570043', 'claude-opus-4-5', 1776160800, 38, 1, 255);
INSERT INTO `quota_data` VALUES (301, 1, '532570043', 'claude-haiku-4-5-thinking', 1776160800, 220, 1, 128);
INSERT INTO `quota_data` VALUES (302, 1, '532570043', 'claude-sonnet-4-thinking', 1776160800, 109, 1, 230);
INSERT INTO `quota_data` VALUES (303, 1, '532570043', 'claude-opus-4-thinking', 1776160800, 175, 1, 5003);
INSERT INTO `quota_data` VALUES (304, 1, '532570043', 'claude-opus-4-1', 1776160800, 38, 1, 765);
INSERT INTO `quota_data` VALUES (305, 1, '532570043', 'claude-opus-4-1-thinking', 1776160800, 169, 1, 4778);
INSERT INTO `quota_data` VALUES (306, 1, '532570043', 'claude-sonnet-4-5', 1776160800, 105, 1, 224);
INSERT INTO `quota_data` VALUES (307, 1, '532570043', 'claude-sonnet-4', 1776160800, 107, 1, 215);
INSERT INTO `quota_data` VALUES (308, 1, '532570043', 'claude-opus-4-5-thinking', 1776160800, 93, 1, 1073);
INSERT INTO `quota_data` VALUES (309, 1, '532570043', 'claude-haiku-4-5', 1776160800, 220, 1, 128);
INSERT INTO `quota_data` VALUES (310, 11, '383669141@qq.com', 'claude-opus-4-6', 1776164400, 3107824, 89, 4494152);
INSERT INTO `quota_data` VALUES (311, 16, 'luolu1182', 'gpt-5.3-codex', 1776164400, 3521969, 24, 121439);
INSERT INTO `quota_data` VALUES (312, 2, 'yangshuo1281', 'gpt-5.4', 1776164400, 195493, 2, 34135);
INSERT INTO `quota_data` VALUES (313, 11, '383669141@qq.com', 'claude-opus-4-6', 1776168000, 3019329, 107, 5167115);
INSERT INTO `quota_data` VALUES (314, 2, 'yangshuo1281', 'gpt-5.4', 1776168000, 23846, 2, 1718);
INSERT INTO `quota_data` VALUES (315, 2, 'yangshuo1281', 'glm-5', 1776168000, 109878, 11, 6860);
INSERT INTO `quota_data` VALUES (316, 16, 'luolu1182', 'gpt-5.3-codex', 1776168000, 4345290, 25, 159180);
INSERT INTO `quota_data` VALUES (317, 16, 'luolu1182', 'gpt-5.3-codex', 1776171600, 2449053, 13, 86906);
INSERT INTO `quota_data` VALUES (318, 11, '383669141@qq.com', 'claude-opus-4-6', 1776171600, 3199007, 140, 5421783);
INSERT INTO `quota_data` VALUES (319, 1, '532570043', 'claude-sonnet-4-6', 1776171600, 416, 1, 720);
INSERT INTO `quota_data` VALUES (320, 1, '532570043', 'claude-opus-4-6', 1776171600, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (321, 1, '532570043', 'claude-opus-4-6-thinking', 1776171600, 497, 1, 1943);
INSERT INTO `quota_data` VALUES (322, 1, '532570043', 'claude-opus-4-5', 1776171600, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (323, 2, 'yangshuo1281', 'glm-5', 1776171600, 1961367, 33, 102996);
INSERT INTO `quota_data` VALUES (324, 11, '383669141@qq.com', 'claude-opus-4-6', 1776175200, 2401305, 30, 2954598);
INSERT INTO `quota_data` VALUES (325, 2, 'yangshuo1281', 'glm-5', 1776175200, 723365, 15, 39350);
INSERT INTO `quota_data` VALUES (326, 1, '532570043', 'claude-opus-4-6', 1776175200, 2715, 4, 8238);
INSERT INTO `quota_data` VALUES (327, 1, '532570043', 'claude-sonnet-4-6', 1776175200, 24, 1, 132);
INSERT INTO `quota_data` VALUES (328, 1, '532570043', 'claude-opus-4-6-thinking', 1776175200, 119270, 8, 123856);
INSERT INTO `quota_data` VALUES (329, 16, 'luolu1182', 'gpt-5.3-codex', 1776175200, 2179007, 26, 144574);
INSERT INTO `quota_data` VALUES (330, 16, 'luolu1182', 'gpt-5.3-codex', 1776178800, 3014823, 42, 131641);
INSERT INTO `quota_data` VALUES (331, 11, '383669141@qq.com', 'claude-opus-4-6', 1776178800, 5069672, 27, 1208344);
INSERT INTO `quota_data` VALUES (332, 11, '383669141@qq.com', 'gpt-5.4', 1776214800, 7615801, 104, 1241669);
INSERT INTO `quota_data` VALUES (333, 2, 'yangshuo1281', 'glm-5', 1776214800, 25754, 4, 1345);
INSERT INTO `quota_data` VALUES (334, 1, '532570043', 'claude-opus-4-6', 1776214800, 75329, 5, 86630);
INSERT INTO `quota_data` VALUES (335, 11, '383669141@qq.com', 'claude-opus-4-6', 1776214800, 2260981, 39, 1091127);
INSERT INTO `quota_data` VALUES (336, 16, 'luolu1182', 'gpt-5.3-codex', 1776214800, 1018985, 10, 55010);
INSERT INTO `quota_data` VALUES (337, 16, 'luolu1182', 'gpt-5.3-codex', 1776218400, 4163040, 32, 171355);
INSERT INTO `quota_data` VALUES (338, 16, 'luolu1182', 'gpt-5.3-codex', 1776222000, 1665555, 11, 37661);
INSERT INTO `quota_data` VALUES (339, 16, 'luolu1182', 'gpt-5.4-mini', 1776222000, 17027, 2, 540);
INSERT INTO `quota_data` VALUES (340, 2, 'yangshuo1281', 'glm-5', 1776222000, 26823, 4, 1358);
INSERT INTO `quota_data` VALUES (341, 1, '532570043', 'claude-sonnet-4-6-thinking', 1776225600, 288, 4, 1272);
INSERT INTO `quota_data` VALUES (342, 1, '532570043', 'claude-sonnet-4-6', 1776225600, 144, 6, 792);
INSERT INTO `quota_data` VALUES (343, 1, '532570043', 'claude-opus-4-6-thinking', 1776225600, 364, 4, 3072);
INSERT INTO `quota_data` VALUES (344, 1, '532570043', 'claude-opus-4-6', 1776225600, 120, 5, 1100);
INSERT INTO `quota_data` VALUES (345, 1, '532570043', 'claude-opus-4-5', 1776225600, 21, 1, 183);
INSERT INTO `quota_data` VALUES (346, 16, 'luolu1182', 'gpt-5.3-codex', 1776225600, 4282226, 26, 148081);
INSERT INTO `quota_data` VALUES (347, 16, 'luolu1182', 'gpt-5.4-mini', 1776225600, 17052, 2, 1069);
INSERT INTO `quota_data` VALUES (348, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776232800, 416537, 4, 470630);
INSERT INTO `quota_data` VALUES (349, 1, '532570043', 'gpt-5.4-thinking', 1776232800, 6841552, 117, 491929);
INSERT INTO `quota_data` VALUES (350, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776232800, 6815631, 27, 6452811);
INSERT INTO `quota_data` VALUES (351, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776232800, 84442, 2, 100667);
INSERT INTO `quota_data` VALUES (352, 1, '532570043', 'gpt-5.4-thinking', 1776236400, 11895369, 150, 776700);
INSERT INTO `quota_data` VALUES (353, 2, 'yangshuo1281', 'glm-5', 1776236400, 12626, 2, 644);
INSERT INTO `quota_data` VALUES (354, 1, '532570043', 'claude-sonnet-4-6', 1776236400, 24, 1, 132);
INSERT INTO `quota_data` VALUES (355, 1, '532570043', 'claude-opus-4-6', 1776236400, 24, 1, 220);
INSERT INTO `quota_data` VALUES (356, 1, '532570043', 'claude-opus-4-6-thinking', 1776236400, 92, 1, 780);
INSERT INTO `quota_data` VALUES (357, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776236400, 3203430, 15, 3168125);
INSERT INTO `quota_data` VALUES (358, 22, 'Thomas', 'claude-sonnet-4-6', 1776236400, 2348364, 24, 1314899);
INSERT INTO `quota_data` VALUES (359, 16, 'luolu1182', 'gpt-5.4-mini', 1776236400, 8451, 1, 290);
INSERT INTO `quota_data` VALUES (360, 16, 'luolu1182', 'gpt-5.3-codex', 1776236400, 345423, 18, 20378);
INSERT INTO `quota_data` VALUES (361, 1, '532570043', 'gpt-5.4-thinking', 1776240000, 7106038, 94, 576209);
INSERT INTO `quota_data` VALUES (362, 16, 'luolu1182', 'gpt-5.3-codex', 1776240000, 4122180, 56, 151887);
INSERT INTO `quota_data` VALUES (363, 22, 'Thomas', 'claude-sonnet-4-6', 1776240000, 1573477, 24, 881932);
INSERT INTO `quota_data` VALUES (364, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776240000, 777952, 13, 810992);
INSERT INTO `quota_data` VALUES (365, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776240000, 92860, 2, 104936);
INSERT INTO `quota_data` VALUES (366, 22, 'Thomas', 'claude-opus-4-6', 1776240000, 5733819, 53, 5782246);
INSERT INTO `quota_data` VALUES (367, 22, 'Thomas', 'claude-opus-4-6', 1776243600, 3661548, 43, 3381402);
INSERT INTO `quota_data` VALUES (368, 2, 'yangshuo1281', 'gpt-5.4', 1776243600, 23180, 2, 3698);
INSERT INTO `quota_data` VALUES (369, 18, 'hmzhou', 'gpt-5.3-codex', 1776243600, 13755, 1, 1329);
INSERT INTO `quota_data` VALUES (370, 22, 'Thomas', 'claude-sonnet-4-6', 1776243600, 1538338, 40, 733957);
INSERT INTO `quota_data` VALUES (371, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776243600, 2313523, 34, 2475580);
INSERT INTO `quota_data` VALUES (372, 22, 'Thomas', 'claude-sonnet-4-6', 1776247200, 956543, 16, 573132);
INSERT INTO `quota_data` VALUES (373, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776247200, 3296316, 63, 2933630);
INSERT INTO `quota_data` VALUES (374, 1, '532570043', 'claude-opus-4-6', 1776247200, 155, 3, 4437);
INSERT INTO `quota_data` VALUES (375, 1, '532570043', 'claude-sonnet-4-6', 1776247200, 66, 2, 1355);
INSERT INTO `quota_data` VALUES (376, 22, 'Thomas', 'claude-sonnet-4-6', 1776250800, 8662466, 99, 4070368);
INSERT INTO `quota_data` VALUES (377, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776250800, 3681493, 84, 3579557);
INSERT INTO `quota_data` VALUES (378, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776250800, 38409, 1, 43237);
INSERT INTO `quota_data` VALUES (379, 22, 'Thomas', 'claude-sonnet-4-6', 1776254400, 4990164, 95, 2322667);
INSERT INTO `quota_data` VALUES (380, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776254400, 696110, 10, 773920);
INSERT INTO `quota_data` VALUES (381, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776258000, 648359, 7, 759091);
INSERT INTO `quota_data` VALUES (382, 1, '532570043', 'claude-opus-4-6', 1776258000, 3060, 30, 9401);
INSERT INTO `quota_data` VALUES (383, 1, '532570043', 'claude-sonnet-4-6', 1776258000, 2951, 25, 5275);
INSERT INTO `quota_data` VALUES (384, 1, '532570043', 'claude-opus-4-5', 1776258000, 1656, 4, 4123);
INSERT INTO `quota_data` VALUES (385, 1, '532570043', 'claude-opus-4-6-thinking', 1776258000, 2886, 14, 11682);
INSERT INTO `quota_data` VALUES (386, 22, 'Thomas', 'claude-sonnet-4-6', 1776258000, 221829, 4, 111927);
INSERT INTO `quota_data` VALUES (387, 2, 'yangshuo1281', 'gpt-5.4', 1776258000, 69936, 5, 8037);
INSERT INTO `quota_data` VALUES (388, 2, 'yangshuo1281', 'glm-5', 1776258000, 11148, 1, 1126);
INSERT INTO `quota_data` VALUES (389, 22, 'Thomas', 'claude-sonnet-4-6', 1776261600, 5007377, 69, 1561853);
INSERT INTO `quota_data` VALUES (390, 2, 'yangshuo1281', 'gpt-5.4', 1776261600, 164030, 3, 37231);
INSERT INTO `quota_data` VALUES (391, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776261600, 141355, 3, 115232);
INSERT INTO `quota_data` VALUES (392, 2, 'yangshuo1281', 'glm-5', 1776261600, 15446, 1, 1622);
INSERT INTO `quota_data` VALUES (393, 22, 'Thomas', 'claude-sonnet-4-6', 1776265200, 6738419, 92, 1495869);
INSERT INTO `quota_data` VALUES (394, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776265200, 4590842, 60, 2049922);
INSERT INTO `quota_data` VALUES (395, 1, '532570043', 'gpt-5.4-thinking', 1776265200, 9809599, 121, 674771);
INSERT INTO `quota_data` VALUES (396, 2, 'yangshuo1281', 'glm-5', 1776265200, 85475, 7, 5936);
INSERT INTO `quota_data` VALUES (397, 1, '532570043', 'gpt-5.4-thinking', 1776268800, 14391894, 214, 988870);
INSERT INTO `quota_data` VALUES (398, 2, 'yangshuo1281', 'glm-5', 1776268800, 492768, 14, 26061);
INSERT INTO `quota_data` VALUES (399, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776268800, 4276377, 56, 3062457);
INSERT INTO `quota_data` VALUES (400, 22, 'Thomas', 'claude-sonnet-4-6', 1776268800, 50844, 2, 35686);
INSERT INTO `quota_data` VALUES (401, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776272400, 3017267, 23, 1877531);
INSERT INTO `quota_data` VALUES (402, 22, 'Thomas', 'claude-sonnet-4-6', 1776272400, 50854, 2, 35720);
INSERT INTO `quota_data` VALUES (403, 2, 'yangshuo1281', 'glm-5', 1776272400, 77477, 7, 4873);
INSERT INTO `quota_data` VALUES (404, 6, '1575376866@qq.com', 'claude-opus-4-6', 1776276000, 146388, 3, 190129);
INSERT INTO `quota_data` VALUES (405, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776276000, 2623028, 37, 1766306);
INSERT INTO `quota_data` VALUES (406, 2, 'yangshuo1281', 'glm-5', 1776276000, 62733, 2, 4002);
INSERT INTO `quota_data` VALUES (407, 22, 'Thomas', 'claude-sonnet-4-6', 1776276000, 50658, 2, 35058);
INSERT INTO `quota_data` VALUES (408, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776279600, 234986, 4, 269535);
INSERT INTO `quota_data` VALUES (409, 22, 'Thomas', 'claude-sonnet-4-6', 1776279600, 50801, 2, 35541);
INSERT INTO `quota_data` VALUES (410, 6, '1575376866@qq.com', 'claude-sonnet-4-6', 1776279600, 405832, 6, 192702);
INSERT INTO `quota_data` VALUES (411, 22, 'Thomas', 'claude-sonnet-4-6', 1776283200, 48025, 2, 33265);
INSERT INTO `quota_data` VALUES (412, 22, 'Thomas', 'claude-sonnet-4-6', 1776286800, 48145, 2, 32738);
INSERT INTO `quota_data` VALUES (413, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776290400, 77614, 2, 96258);
INSERT INTO `quota_data` VALUES (414, 22, 'Thomas', 'claude-sonnet-4-6', 1776290400, 48211, 2, 32961);
INSERT INTO `quota_data` VALUES (415, 22, 'Thomas', 'claude-sonnet-4-6', 1776294000, 48216, 2, 32978);
INSERT INTO `quota_data` VALUES (416, 22, 'Thomas', 'claude-sonnet-4-6', 1776297600, 12054348, 172, 2135325);
INSERT INTO `quota_data` VALUES (417, 22, 'Thomas', 'claude-sonnet-4-6', 1776301200, 3308544, 42, 870202);
INSERT INTO `quota_data` VALUES (418, 18, 'hmzhou', 'gpt-5.4-mini', 1776297600, 8616, 1, 701);
INSERT INTO `quota_data` VALUES (419, 18, 'hmzhou', 'gpt-5.3-codex', 1776297600, 253783, 13, 12327);
INSERT INTO `quota_data` VALUES (420, 18, 'hmzhou', 'gpt-5.3-codex', 1776301200, 2019914, 47, 102447);
INSERT INTO `quota_data` VALUES (421, 2, 'yangshuo1281', 'glm-5', 1776301200, 16805, 2, 856);
INSERT INTO `quota_data` VALUES (422, 18, 'hmzhou', 'gpt-5.3-codex', 1776304800, 984857, 14, 40158);
INSERT INTO `quota_data` VALUES (423, 22, 'Thomas', 'claude-sonnet-4-6', 1776304800, 24762, 1, 18364);
INSERT INTO `quota_data` VALUES (424, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776308400, 529659, 9, 583671);
INSERT INTO `quota_data` VALUES (425, 18, 'hmzhou', 'gpt-5.3-codex', 1776308400, 1076346, 14, 59934);
INSERT INTO `quota_data` VALUES (426, 2, 'yangshuo1281', 'gpt-5.4', 1776312000, 528206, 23, 48604);
INSERT INTO `quota_data` VALUES (427, 2, 'yangshuo1281', 'gpt-5.4', 1776315600, 4581808, 60, 322495);
INSERT INTO `quota_data` VALUES (428, 1, '532570043', 'gpt-5.4-thinking', 1776315600, 5412772, 89, 508185);
INSERT INTO `quota_data` VALUES (429, 1, '532570043', 'claude-sonnet-4-6', 1776315600, 36, 1, 150);
INSERT INTO `quota_data` VALUES (430, 1, '532570043', 'claude-opus-4-6', 1776315600, 36, 1, 250);
INSERT INTO `quota_data` VALUES (431, 1, '532570043', 'claude-opus-4-6-thinking', 1776315600, 105, 1, 823);
INSERT INTO `quota_data` VALUES (432, 5, 'fengpengzhengju1', 'gpt-5.4', 1776315600, 18, 1, 18);
INSERT INTO `quota_data` VALUES (433, 1, '532570043', 'gpt-5.4-thinking', 1776319200, 10402255, 121, 791376);
INSERT INTO `quota_data` VALUES (434, 2, 'yangshuo1281', 'gpt-5.4', 1776319200, 4551134, 72, 247968);
INSERT INTO `quota_data` VALUES (435, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776319200, 6466543, 83, 1706086);
INSERT INTO `quota_data` VALUES (436, 1, '532570043', 'claude-opus-4-6', 1776319200, 498, 4, 1091);
INSERT INTO `quota_data` VALUES (437, 1, '532570043', 'claude-sonnet-4-6', 1776319200, 84, 3, 332);
INSERT INTO `quota_data` VALUES (438, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776319200, 2088579, 31, 2493799);
INSERT INTO `quota_data` VALUES (439, 1, '532570043', 'claude-sonnet-4-6-thinking', 1776319200, 144, 2, 636);
INSERT INTO `quota_data` VALUES (440, 1, '532570043', 'claude-opus-4-6-thinking', 1776319200, 181, 2, 1523);
INSERT INTO `quota_data` VALUES (441, 2, 'yangshuo1281', 'gpt-5.4', 1776322800, 1117612, 22, 71844);
INSERT INTO `quota_data` VALUES (442, 1, '532570043', 'claude-opus-4-6', 1776322800, 17529, 12, 136621);
INSERT INTO `quota_data` VALUES (443, 1, '532570043', 'gpt-5.4-thinking', 1776322800, 1996327, 12, 110954);
INSERT INTO `quota_data` VALUES (444, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776322800, 2504888, 18, 634970);
INSERT INTO `quota_data` VALUES (445, 1, '532570043', 'claude-sonnet-4-6', 1776322800, 5640, 12, 60082);
INSERT INTO `quota_data` VALUES (446, 1, '532570043', 'claude-opus-4-6-thinking', 1776322800, 7752071, 59, 14351590);
INSERT INTO `quota_data` VALUES (447, 1, '532570043', 'claude-sonnet-4-6-thinking', 1776322800, 4625, 8, 66835);
INSERT INTO `quota_data` VALUES (448, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776322800, 997909, 14, 1384493);
INSERT INTO `quota_data` VALUES (449, 5, 'fengpengzhengju1', 'claude-sonnet-4-6', 1776322800, 52627, 2, 36298);
INSERT INTO `quota_data` VALUES (450, 1, '532570043', 'claude-opus-4-6-thinking', 1776326400, 3565318, 29, 4724410);
INSERT INTO `quota_data` VALUES (451, 1, '532570043', 'claude-opus-4-6', 1776326400, 3366281, 21, 4153512);
INSERT INTO `quota_data` VALUES (452, 1, '532570043', 'claude-opus-4-5', 1776326400, 1481, 2, 3633);
INSERT INTO `quota_data` VALUES (453, 1, '532570043', 'claude-sonnet-4-6', 1776326400, 12270, 5, 36378);
INSERT INTO `quota_data` VALUES (454, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776326400, 3686453, 49, 4583288);
INSERT INTO `quota_data` VALUES (455, 2, 'yangshuo1281', 'gpt-5.4', 1776326400, 353974, 20, 31941);
INSERT INTO `quota_data` VALUES (456, 2, 'yangshuo1281', 'gpt-5.4', 1776330000, 101685, 7, 15683);
INSERT INTO `quota_data` VALUES (457, 1, '532570043', 'claude-opus-4-6', 1776330000, 4796503, 50, 6993209);
INSERT INTO `quota_data` VALUES (458, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776330000, 1590636, 29, 1924801);
INSERT INTO `quota_data` VALUES (459, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776330000, 167401, 3, 44913);
INSERT INTO `quota_data` VALUES (460, 1, '532570043', 'claude-opus-4-6', 1776333600, 338408, 3, 476859);
INSERT INTO `quota_data` VALUES (461, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776333600, 381798, 4, 475049);
INSERT INTO `quota_data` VALUES (462, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776333600, 6812692, 70, 1659789);
INSERT INTO `quota_data` VALUES (463, 1, '532570043', 'gpt-5.4', 1776333600, 6485684, 28, 266995);
INSERT INTO `quota_data` VALUES (464, 1, '532570043', 'gpt-5.4', 1776337200, 5667079, 79, 217973);
INSERT INTO `quota_data` VALUES (465, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776337200, 1327078, 27, 357116);
INSERT INTO `quota_data` VALUES (466, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776340800, 841164, 12, 217346);
INSERT INTO `quota_data` VALUES (467, 2, 'yangshuo1281', 'gpt-5.4', 1776340800, 22906, 3, 5568);
INSERT INTO `quota_data` VALUES (468, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776344400, 517795, 6, 133452);
INSERT INTO `quota_data` VALUES (469, 28, 'ars6868@163.com', 'glm-5', 1776348000, 395507, 16, 19994);
INSERT INTO `quota_data` VALUES (470, 1, '532570043', 'gpt-5.4', 1776348000, 13502122, 58, 536584);
INSERT INTO `quota_data` VALUES (471, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776348000, 3304069, 40, 827988);
INSERT INTO `quota_data` VALUES (472, 1, '532570043', 'glm-5', 1776348000, 143557, 10, 7883);
INSERT INTO `quota_data` VALUES (473, 1, '532570043', 'glm-5-thinking', 1776348000, 129, 1, 206);
INSERT INTO `quota_data` VALUES (474, 1, '532570043', 'gpt-5.4', 1776351600, 24841003, 105, 799047);
INSERT INTO `quota_data` VALUES (475, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776351600, 8449292, 68, 2092409);
INSERT INTO `quota_data` VALUES (476, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776355200, 3178529, 41, 861999);
INSERT INTO `quota_data` VALUES (477, 1, '532570043', 'gpt-5.4', 1776355200, 15202651, 128, 628956);
INSERT INTO `quota_data` VALUES (478, 2, 'yangshuo1281', 'gpt-5.4', 1776355200, 22880, 2, 3591);
INSERT INTO `quota_data` VALUES (479, 1, '532570043', 'gpt-5.4', 1776358800, 9750381, 75, 393210);
INSERT INTO `quota_data` VALUES (480, 1, '532570043', 'glm-5', 1776358800, 44, 2, 58);
INSERT INTO `quota_data` VALUES (481, 2, 'yangshuo1281', 'gpt-5.4', 1776358800, 21811, 4, 3990);
INSERT INTO `quota_data` VALUES (482, 1, '532570043', 'gpt-5.4', 1776362400, 9450490, 188, 612474);
INSERT INTO `quota_data` VALUES (483, 11, '383669141@qq.com', 'gpt-5.4', 1776362400, 15640, 2, 4119);
INSERT INTO `quota_data` VALUES (484, 2, 'yangshuo1281', 'gpt-5.4', 1776362400, 154335, 10, 53699);
INSERT INTO `quota_data` VALUES (485, 1, '532570043', 'gpt-5.4', 1776366000, 1513694, 10, 49327);
INSERT INTO `quota_data` VALUES (486, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776380400, 1359424, 19, 350025);
INSERT INTO `quota_data` VALUES (487, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776384000, 2564998, 27, 645657);
INSERT INTO `quota_data` VALUES (488, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776387600, 5902316, 48, 1484746);
INSERT INTO `quota_data` VALUES (489, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776387600, 1816982, 27, 2239292);
INSERT INTO `quota_data` VALUES (490, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776391200, 3046344, 62, 3973663);
INSERT INTO `quota_data` VALUES (491, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776391200, 815948, 22, 230864);
INSERT INTO `quota_data` VALUES (492, 18, 'hmzhou', 'gpt-5.4-mini', 1776391200, 8733, 1, 535);
INSERT INTO `quota_data` VALUES (493, 18, 'hmzhou', 'gpt-5.3-codex', 1776391200, 1036490, 17, 57000);
INSERT INTO `quota_data` VALUES (494, 2, 'yangshuo1281', 'gpt-5.4', 1776394800, 732709, 53, 80566);
INSERT INTO `quota_data` VALUES (495, 18, 'hmzhou', 'gpt-5.3-codex', 1776394800, 3358062, 31, 105604);
INSERT INTO `quota_data` VALUES (496, 34, 'lonesea', 'claude-opus-4-6', 1776394800, 7300, 2, 39379);
INSERT INTO `quota_data` VALUES (497, 34, 'lonesea', 'claude-sonnet-4-6', 1776394800, 6796, 2, 20979);
INSERT INTO `quota_data` VALUES (498, 34, 'lonesea', 'claude-opus-4-6-thinking', 1776394800, 9020, 2, 47353);
INSERT INTO `quota_data` VALUES (499, 18, 'hmzhou', 'gpt-5.3-codex', 1776398400, 1889447, 15, 76134);
INSERT INTO `quota_data` VALUES (500, 1, '532570043', 'gpt-5.4', 1776398400, 629779, 4, 52812);
INSERT INTO `quota_data` VALUES (501, 1, '532570043', 'glm-5', 1776398400, 22, 1, 29);
INSERT INTO `quota_data` VALUES (502, 1, '532570043', 'claude-opus-4-6', 1776398400, 1618088, 24, 2357562);
INSERT INTO `quota_data` VALUES (503, 1, '532570043', 'claude-sonnet-4-6', 1776398400, 60, 2, 530);
INSERT INTO `quota_data` VALUES (504, 34, 'lonesea', 'claude-opus-4-6', 1776398400, 36, 1, 113);
INSERT INTO `quota_data` VALUES (505, 34, 'lonesea', 'claude-sonnet-4-6', 1776398400, 36, 1, 68);
INSERT INTO `quota_data` VALUES (506, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776398400, 1142818, 22, 307550);
INSERT INTO `quota_data` VALUES (507, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776398400, 2329515, 18, 2773613);
INSERT INTO `quota_data` VALUES (508, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776402000, 1990013, 32, 2429394);
INSERT INTO `quota_data` VALUES (509, 18, 'hmzhou', 'gpt-5.3-codex', 1776402000, 846493, 6, 49930);
INSERT INTO `quota_data` VALUES (510, 34, 'lonesea', 'claude-opus-4-6', 1776402000, 29606992, 404, 40800041);
INSERT INTO `quota_data` VALUES (511, 34, 'lonesea', 'claude-sonnet-4-6', 1776402000, 189, 3, 312);
INSERT INTO `quota_data` VALUES (512, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776402000, 44804, 5, 569);
INSERT INTO `quota_data` VALUES (513, 1, '532570043', 'claude-opus-4-6', 1776402000, 1492798, 23, 2290200);
INSERT INTO `quota_data` VALUES (514, 1, '532570043', 'deepseek-3.2', 1776402000, 15, 1, 3);
INSERT INTO `quota_data` VALUES (515, 1, '532570043', 'deepseek-3.2-thinking', 1776402000, 111, 1, 25);
INSERT INTO `quota_data` VALUES (516, 34, 'lonesea', 'claude-opus-4-6', 1776405600, 29282556, 205, 37827833);
INSERT INTO `quota_data` VALUES (517, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776405600, 3698068, 92, 47135);
INSERT INTO `quota_data` VALUES (518, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776405600, 1940124, 26, 2411273);
INSERT INTO `quota_data` VALUES (519, 34, 'lonesea', 'claude-sonnet-4-6', 1776405600, 35, 1, 56);
INSERT INTO `quota_data` VALUES (520, 18, 'hmzhou', 'gpt-5.3-codex', 1776405600, 1271708, 8, 53788);
INSERT INTO `quota_data` VALUES (521, 2, 'yangshuo1281', 'gpt-5.4', 1776405600, 84912, 7, 8565);
INSERT INTO `quota_data` VALUES (522, 1, '532570043', 'claude-opus-4-6', 1776405600, 312543, 10, 469790);
INSERT INTO `quota_data` VALUES (523, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776409200, 758755, 16, 9670);
INSERT INTO `quota_data` VALUES (524, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776409200, 1087265, 14, 279843);
INSERT INTO `quota_data` VALUES (525, 5, 'fengpengzhengju1', 'gpt-5.4-thinking', 1776405600, 121564, 2, 32621);
INSERT INTO `quota_data` VALUES (526, 34, 'lonesea', 'claude-opus-4-6', 1776409200, 17594124, 315, 24242824);
INSERT INTO `quota_data` VALUES (527, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776409200, 2695863, 86, 3755636);
INSERT INTO `quota_data` VALUES (528, 1, '532570043', 'claude-opus-4-6', 1776409200, 292802, 18, 870664);
INSERT INTO `quota_data` VALUES (529, 2, 'yangshuo1281', 'gpt-5.4', 1776409200, 1123722, 34, 62765);
INSERT INTO `quota_data` VALUES (530, 18, 'hmzhou', 'gpt-5.3-codex', 1776409200, 2094043, 12, 72851);
INSERT INTO `quota_data` VALUES (531, 34, 'lonesea', 'claude-opus-4-6', 1776412800, 10967884, 316, 16324342);
INSERT INTO `quota_data` VALUES (532, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776412800, 1685478, 86, 2690064);
INSERT INTO `quota_data` VALUES (533, 2, 'yangshuo1281', 'gpt-5.4', 1776412800, 5014653, 84, 338285);
INSERT INTO `quota_data` VALUES (534, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776412800, 159577, 2, 1997);
INSERT INTO `quota_data` VALUES (535, 11, '383669141@qq.com', 'gpt-5.4', 1776412800, 17912, 1, 4478);
INSERT INTO `quota_data` VALUES (536, 18, 'hmzhou', 'gpt-5.3-codex', 1776412800, 1115748, 6, 54740);
INSERT INTO `quota_data` VALUES (537, 34, 'lonesea', 'claude-opus-4-6', 1776416400, 7041363, 149, 9689247);
INSERT INTO `quota_data` VALUES (538, 2, 'yangshuo1281', 'gpt-5.4', 1776416400, 4162202, 70, 313438);
INSERT INTO `quota_data` VALUES (539, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776416400, 1548359, 63, 2395228);
INSERT INTO `quota_data` VALUES (540, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776416400, 632669, 8, 7918);
INSERT INTO `quota_data` VALUES (541, 2, 'yangshuo1281', 'gpt-5.4', 1776420000, 2441874, 40, 133822);
INSERT INTO `quota_data` VALUES (542, 34, 'lonesea', 'claude-opus-4-6', 1776420000, 16553213, 476, 26575223);
INSERT INTO `quota_data` VALUES (543, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776420000, 664093, 5, 8303);
INSERT INTO `quota_data` VALUES (544, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776420000, 88542, 1, 100195);
INSERT INTO `quota_data` VALUES (545, 34, 'lonesea', 'claude-opus-4-6', 1776423600, 2992849, 64, 4121584);
INSERT INTO `quota_data` VALUES (546, 1, '532570043', 'claude-opus-4-6', 1776423600, 3826747, 57, 4086076);
INSERT INTO `quota_data` VALUES (547, 2, 'yangshuo1281', 'gpt-5.4', 1776423600, 2860740, 36, 228528);
INSERT INTO `quota_data` VALUES (548, 34, 'lonesea', 'claude-sonnet-4-6', 1776423600, 416, 1, 324);
INSERT INTO `quota_data` VALUES (549, 11, '383669141@qq.com', 'claude-opus-4-6', 1776427200, 7860914, 67, 3911931);
INSERT INTO `quota_data` VALUES (550, 1, '532570043', 'claude-opus-4-6', 1776427200, 10710848, 49, 4352160);
INSERT INTO `quota_data` VALUES (551, 34, 'lonesea', 'claude-opus-4-6', 1776427200, 2908991, 51, 3516372);
INSERT INTO `quota_data` VALUES (552, 1, '532570043', 'claude-opus-4-6', 1776430800, 1226139, 6, 306022);
INSERT INTO `quota_data` VALUES (553, 11, '383669141@qq.com', 'claude-opus-4-6', 1776430800, 1162637, 16, 492078);
INSERT INTO `quota_data` VALUES (554, 34, 'lonesea', 'claude-opus-4-6', 1776430800, 2652115, 45, 3200083);
INSERT INTO `quota_data` VALUES (555, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776434400, 104398, 2, 1308);
INSERT INTO `quota_data` VALUES (556, 34, 'lonesea', 'claude-opus-4-6', 1776434400, 691169, 27, 871633);
INSERT INTO `quota_data` VALUES (557, 11, '383669141@qq.com', 'claude-opus-4-6', 1776434400, 783844, 9, 429463);
INSERT INTO `quota_data` VALUES (558, 1, '532570043', 'claude-opus-4-6', 1776434400, 1325110, 46, 2914731);
INSERT INTO `quota_data` VALUES (559, 2, 'yangshuo1281', 'gpt-5.4', 1776434400, 22890, 2, 3844);
INSERT INTO `quota_data` VALUES (560, 1, '532570043', 'claude-opus-4-6', 1776438000, 266213, 15, 911209);
INSERT INTO `quota_data` VALUES (561, 34, 'lonesea', 'claude-opus-4-6', 1776438000, 2264402, 37, 2650005);
INSERT INTO `quota_data` VALUES (562, 22, 'Thomas', 'claude-sonnet-4-6', 1776438000, 2638912, 33, 2091986);
INSERT INTO `quota_data` VALUES (563, 2, 'yangshuo1281', 'gpt-5.4', 1776438000, 1427232, 18, 79069);
INSERT INTO `quota_data` VALUES (564, 34, 'lonesea', 'claude-sonnet-4-6', 1776438000, 53114, 2, 39092);
INSERT INTO `quota_data` VALUES (565, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776438000, 143040, 1, 126497);
INSERT INTO `quota_data` VALUES (566, 34, 'lonesea', 'claude-opus-4-6', 1776441600, 2586123, 76, 3575603);
INSERT INTO `quota_data` VALUES (567, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776441600, 2834626, 53, 3104706);
INSERT INTO `quota_data` VALUES (568, 34, 'lonesea', 'claude-sonnet-4-6', 1776441600, 1126946, 110, 1110857);
INSERT INTO `quota_data` VALUES (569, 22, 'Thomas', 'claude-sonnet-4-6', 1776441600, 188749, 4, 140705);
INSERT INTO `quota_data` VALUES (570, 2, 'yangshuo1281', 'gpt-5.4', 1776441600, 795638, 13, 34987);
INSERT INTO `quota_data` VALUES (571, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776441600, 1109873, 29, 14048);
INSERT INTO `quota_data` VALUES (572, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776445200, 2099110, 51, 26528);
INSERT INTO `quota_data` VALUES (573, 34, 'lonesea', 'claude-opus-4-6', 1776445200, 1553068, 38, 1908145);
INSERT INTO `quota_data` VALUES (574, 22, 'Thomas', 'claude-sonnet-4-6', 1776445200, 194601, 4, 145050);
INSERT INTO `quota_data` VALUES (575, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776445200, 923111, 16, 1172140);
INSERT INTO `quota_data` VALUES (576, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776448800, 2139154, 43, 27131);
INSERT INTO `quota_data` VALUES (577, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776448800, 3366117, 87, 5148038);
INSERT INTO `quota_data` VALUES (578, 34, 'lonesea', 'claude-opus-4-6', 1776448800, 893265, 19, 1067834);
INSERT INTO `quota_data` VALUES (579, 22, 'Thomas', 'claude-sonnet-4-6', 1776448800, 200453, 4, 149395);
INSERT INTO `quota_data` VALUES (580, 34, 'lonesea', 'claude-opus-4-6', 1776452400, 1031857, 20, 1229857);
INSERT INTO `quota_data` VALUES (581, 22, 'Thomas', 'claude-sonnet-4-6', 1776452400, 308443, 4, 215780);
INSERT INTO `quota_data` VALUES (582, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776452400, 2940571, 45, 3657217);
INSERT INTO `quota_data` VALUES (583, 34, 'lonesea', 'claude-opus-4-6', 1776456000, 693678, 11, 811177);
INSERT INTO `quota_data` VALUES (584, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776456000, 1409221, 70, 2441872);
INSERT INTO `quota_data` VALUES (585, 22, 'Thomas', 'claude-sonnet-4-6', 1776456000, 48347, 2, 33380);
INSERT INTO `quota_data` VALUES (586, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776459600, 4077426, 80, 5473451);
INSERT INTO `quota_data` VALUES (587, 34, 'lonesea', 'claude-opus-4-6', 1776459600, 637213, 15, 811340);
INSERT INTO `quota_data` VALUES (588, 22, 'Thomas', 'claude-sonnet-4-6', 1776459600, 48537, 2, 33040);
INSERT INTO `quota_data` VALUES (589, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776459600, 99152, 2, 1247);
INSERT INTO `quota_data` VALUES (590, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776463200, 1296535, 87, 2539216);
INSERT INTO `quota_data` VALUES (591, 34, 'lonesea', 'claude-opus-4-6', 1776463200, 1023269, 32, 1455737);
INSERT INTO `quota_data` VALUES (592, 22, 'Thomas', 'claude-sonnet-4-6', 1776463200, 48564, 2, 33132);
INSERT INTO `quota_data` VALUES (593, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776466800, 3050217, 115, 5470998);
INSERT INTO `quota_data` VALUES (594, 34, 'lonesea', 'claude-opus-4-6', 1776466800, 883689, 20, 1102438);
INSERT INTO `quota_data` VALUES (595, 22, 'Thomas', 'claude-sonnet-4-6', 1776466800, 48652, 2, 33428);
INSERT INTO `quota_data` VALUES (596, 22, 'Thomas', 'claude-sonnet-4-6', 1776470400, 2896464, 160, 3295839);
INSERT INTO `quota_data` VALUES (597, 34, 'lonesea', 'claude-opus-4-6', 1776470400, 842368, 17, 1039579);
INSERT INTO `quota_data` VALUES (598, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776470400, 2093975, 51, 2860273);
INSERT INTO `quota_data` VALUES (599, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776474000, 1306495, 50, 2061569);
INSERT INTO `quota_data` VALUES (600, 34, 'lonesea', 'claude-opus-4-6', 1776474000, 973121, 25, 1239353);
INSERT INTO `quota_data` VALUES (601, 22, 'Thomas', 'claude-sonnet-4-6', 1776474000, 194106, 4, 140700);
INSERT INTO `quota_data` VALUES (602, 2, 'yangshuo1281', 'gpt-5.4', 1776474000, 2461100, 36, 214988);
INSERT INTO `quota_data` VALUES (603, 2, 'yangshuo1281', 'glm-5', 1776474000, 253536, 20, 13420);
INSERT INTO `quota_data` VALUES (604, 34, 'lonesea', 'claude-sonnet-4-6', 1776474000, 36, 1, 68);
INSERT INTO `quota_data` VALUES (605, 2, 'yangshuo1281', 'gpt-5.4', 1776477600, 1787751, 22, 85767);
INSERT INTO `quota_data` VALUES (606, 34, 'lonesea', 'claude-opus-4-6', 1776477600, 1714046, 68, 2750879);
INSERT INTO `quota_data` VALUES (607, 22, 'Thomas', 'claude-sonnet-4-6', 1776477600, 150288, 6, 105159);
INSERT INTO `quota_data` VALUES (608, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776477600, 690268, 22, 1126276);
INSERT INTO `quota_data` VALUES (609, 34, 'lonesea', 'claude-opus-4-6', 1776481200, 4503919, 251, 8988924);
INSERT INTO `quota_data` VALUES (610, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776481200, 100538, 2, 1264);
INSERT INTO `quota_data` VALUES (611, 22, 'Thomas', 'claude-sonnet-4-6', 1776481200, 53398, 5, 46858);
INSERT INTO `quota_data` VALUES (612, 2, 'yangshuo1281', 'gpt-5.4', 1776481200, 1175935, 14, 100475);
INSERT INTO `quota_data` VALUES (613, 34, 'lonesea', 'claude-opus-4-6', 1776484800, 2605572, 157, 5053971);
INSERT INTO `quota_data` VALUES (614, 2, 'yangshuo1281', 'gpt-5.4', 1776484800, 3568350, 43, 293780);
INSERT INTO `quota_data` VALUES (615, 22, 'Thomas', 'claude-sonnet-4-6', 1776484800, 51449, 4, 41855);
INSERT INTO `quota_data` VALUES (616, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776484800, 101934, 2, 1281);
INSERT INTO `quota_data` VALUES (617, 34, 'lonesea', 'claude-opus-4-6', 1776488400, 1729759, 94, 3396958);
INSERT INTO `quota_data` VALUES (618, 22, 'Thomas', 'claude-sonnet-4-6', 1776488400, 1592362, 73, 1663178);
INSERT INTO `quota_data` VALUES (619, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776488400, 1221594, 18, 15357);
INSERT INTO `quota_data` VALUES (620, 2, 'yangshuo1281', 'gpt-5.4', 1776488400, 2137847, 30, 139187);
INSERT INTO `quota_data` VALUES (621, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776488400, 1940346, 40, 2796962);
INSERT INTO `quota_data` VALUES (622, 1, '532570043', 'claude-opus-4-6', 1776488400, 739741, 14, 1247054);
INSERT INTO `quota_data` VALUES (623, 34, 'lonesea', 'claude-opus-4-6', 1776492000, 1982308, 21, 2815662);
INSERT INTO `quota_data` VALUES (624, 1, '532570043', 'claude-opus-4-6', 1776492000, 3877367, 34, 3450847);
INSERT INTO `quota_data` VALUES (625, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776492000, 2137618, 55, 26911);
INSERT INTO `quota_data` VALUES (626, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776492000, 2191908, 39, 3033689);
INSERT INTO `quota_data` VALUES (627, 22, 'Thomas', 'claude-sonnet-4-6', 1776492000, 50271, 4, 40398);
INSERT INTO `quota_data` VALUES (628, 11, '383669141@qq.com', 'claude-opus-4-6', 1776492000, 381177, 12, 261307);
INSERT INTO `quota_data` VALUES (629, 2, 'yangshuo1281', 'gpt-5.4', 1776492000, 54641, 5, 8616);
INSERT INTO `quota_data` VALUES (630, 6, '1575376866@qq.com', 'claude-sonnet-4-6', 1776492000, 12, 1, 8);
INSERT INTO `quota_data` VALUES (631, 34, 'lonesea', 'claude-opus-4-6', 1776495600, 4182309, 171, 6714133);
INSERT INTO `quota_data` VALUES (632, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776495600, 625211, 12, 7941);
INSERT INTO `quota_data` VALUES (633, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776495600, 1400928, 36, 1879549);
INSERT INTO `quota_data` VALUES (634, 22, 'Thomas', 'claude-sonnet-4-6', 1776495600, 76835, 5, 58643);
INSERT INTO `quota_data` VALUES (635, 1, '532570043', 'claude-opus-4-6-thinking', 1776495600, 22, 1, 185);
INSERT INTO `quota_data` VALUES (636, 1, '532570043', 'claude-sonnet-4-6', 1776495600, 22, 1, 111);
INSERT INTO `quota_data` VALUES (637, 1, '532570043', 'claude-haiku-4-5', 1776495600, 12, 1, 28);
INSERT INTO `quota_data` VALUES (638, 1, '532570043', 'claude-sonnet-4-5', 1776495600, 15, 1, 107);
INSERT INTO `quota_data` VALUES (639, 1, '532570043', 'claude-sonnet-4-5-thinking', 1776495600, 15, 1, 107);
INSERT INTO `quota_data` VALUES (640, 1, '532570043', 'claude-opus-4-6', 1776495600, 2702800, 12, 2407000);
INSERT INTO `quota_data` VALUES (641, 1, '532570043', 'claude-haiku-4-5-thinking', 1776495600, 12, 1, 28);
INSERT INTO `quota_data` VALUES (642, 1, '532570043', 'claude-sonnet-4', 1776495600, 84, 1, 624);
INSERT INTO `quota_data` VALUES (643, 1, '532570043', 'claude-sonnet-4-thinking', 1776495600, 84, 1, 624);
INSERT INTO `quota_data` VALUES (644, 1, '532570043', 'gpt-5.4', 1776495600, 3963205, 20, 152066);
INSERT INTO `quota_data` VALUES (645, 1, '532570043', 'gpt-5.4', 1776499200, 9994595, 71, 353639);
INSERT INTO `quota_data` VALUES (646, 34, 'lonesea', 'claude-opus-4-6', 1776499200, 5569759, 258, 9861232);
INSERT INTO `quota_data` VALUES (647, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776499200, 2841383, 79, 4482022);
INSERT INTO `quota_data` VALUES (648, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776499200, 2394604, 47, 30283);
INSERT INTO `quota_data` VALUES (649, 11, '383669141@qq.com', 'claude-opus-4-6', 1776499200, 167081, 5, 207520);
INSERT INTO `quota_data` VALUES (650, 22, 'Thomas', 'claude-sonnet-4-6', 1776499200, 51797, 2, 35765);
INSERT INTO `quota_data` VALUES (651, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776499200, 83344, 2, 11590);
INSERT INTO `quota_data` VALUES (652, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776502800, 1235649, 68, 2250199);
INSERT INTO `quota_data` VALUES (653, 34, 'lonesea', 'claude-opus-4-6', 1776502800, 3041274, 162, 5800152);
INSERT INTO `quota_data` VALUES (654, 1, '532570043', 'gpt-5.4', 1776502800, 13696627, 120, 522870);
INSERT INTO `quota_data` VALUES (655, 22, 'Thomas', 'claude-sonnet-4-6', 1776502800, 51760, 2, 35640);
INSERT INTO `quota_data` VALUES (656, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776502800, 168088, 4, 4654);
INSERT INTO `quota_data` VALUES (657, 34, 'lonesea', 'claude-sonnet-4-6', 1776502800, 104509, 1, 88326);
INSERT INTO `quota_data` VALUES (658, 2, 'yangshuo1281', 'gpt-5.4', 1776502800, 36342, 2, 21935);
INSERT INTO `quota_data` VALUES (659, 34, 'lonesea', 'claude-opus-4-6', 1776506400, 3084683, 205, 6574605);
INSERT INTO `quota_data` VALUES (660, 34, 'lonesea', 'claude-sonnet-4-6', 1776506400, 317120, 4, 223571);
INSERT INTO `quota_data` VALUES (661, 22, 'Thomas', 'claude-sonnet-4-6', 1776506400, 53194, 4, 41243);
INSERT INTO `quota_data` VALUES (662, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776506400, 2179604, 57, 3373055);
INSERT INTO `quota_data` VALUES (663, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776506400, 169919, 4, 4687);
INSERT INTO `quota_data` VALUES (664, 2, 'yangshuo1281', 'gpt-5.4', 1776506400, 83261, 3, 25158);
INSERT INTO `quota_data` VALUES (665, 34, 'lonesea', 'claude-opus-4-6', 1776510000, 2957240, 107, 4995287);
INSERT INTO `quota_data` VALUES (666, 2, 'yangshuo1281', 'gpt-5.4', 1776510000, 388691, 21, 36046);
INSERT INTO `quota_data` VALUES (667, 22, 'Thomas', 'claude-sonnet-4-6', 1776510000, 53379, 4, 40973);
INSERT INTO `quota_data` VALUES (668, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776510000, 171755, 4, 4671);
INSERT INTO `quota_data` VALUES (669, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776510000, 898861, 16, 11336);
INSERT INTO `quota_data` VALUES (670, 34, 'lonesea', 'claude-opus-4-6', 1776513600, 3237714, 67, 4411258);
INSERT INTO `quota_data` VALUES (671, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776513600, 2190597, 29, 27530);
INSERT INTO `quota_data` VALUES (672, 22, 'Thomas', 'claude-sonnet-4-6', 1776513600, 1169021, 23, 952281);
INSERT INTO `quota_data` VALUES (673, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776513600, 173633, 4, 4833);
INSERT INTO `quota_data` VALUES (674, 34, 'lonesea', 'claude-opus-4-6', 1776517200, 2221667, 28, 2653974);
INSERT INTO `quota_data` VALUES (675, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776517200, 1672441, 19, 21114);
INSERT INTO `quota_data` VALUES (676, 22, 'Thomas', 'claude-sonnet-4-6', 1776517200, 53875, 3, 39455);
INSERT INTO `quota_data` VALUES (677, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776517200, 175466, 4, 4811);
INSERT INTO `quota_data` VALUES (678, 2, 'yangshuo1281', 'gpt-5.4', 1776517200, 344869, 12, 79693);
INSERT INTO `quota_data` VALUES (679, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776517200, 510165, 3, 576478);
INSERT INTO `quota_data` VALUES (680, 2, 'yangshuo1281', 'gpt-5.4', 1776520800, 406069, 14, 45112);
INSERT INTO `quota_data` VALUES (681, 34, 'lonesea', 'claude-opus-4-6', 1776520800, 1238653, 18, 1558006);
INSERT INTO `quota_data` VALUES (682, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776520800, 2620954, 48, 32993);
INSERT INTO `quota_data` VALUES (683, 22, 'Thomas', 'claude-sonnet-4-6', 1776520800, 27312, 2, 21192);
INSERT INTO `quota_data` VALUES (684, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776520800, 177299, 4, 4818);
INSERT INTO `quota_data` VALUES (685, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776520800, 342409, 2, 386236);
INSERT INTO `quota_data` VALUES (686, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776520800, 1440050, 16, 1796344);
INSERT INTO `quota_data` VALUES (687, 34, 'lonesea', 'claude-opus-4-6', 1776524400, 1373768, 19, 1562864);
INSERT INTO `quota_data` VALUES (688, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776524400, 2417610, 55, 3480798);
INSERT INTO `quota_data` VALUES (689, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776524400, 982002, 27, 12347);
INSERT INTO `quota_data` VALUES (690, 22, 'Thomas', 'claude-sonnet-4-6', 1776524400, 27436, 2, 21357);
INSERT INTO `quota_data` VALUES (691, 2, 'yangshuo1281', 'gpt-5.4', 1776524400, 84042, 7, 9946);
INSERT INTO `quota_data` VALUES (692, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776524400, 179161, 4, 14892);
INSERT INTO `quota_data` VALUES (693, 34, 'lonesea', 'claude-opus-4-6', 1776528000, 1557765, 26, 1942933);
INSERT INTO `quota_data` VALUES (694, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776528000, 381053, 16, 4806);
INSERT INTO `quota_data` VALUES (695, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776528000, 1175633, 14, 1362440);
INSERT INTO `quota_data` VALUES (696, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776528000, 181008, 4, 4927);
INSERT INTO `quota_data` VALUES (697, 2, 'yangshuo1281', 'gpt-5.4', 1776528000, 1277273, 32, 116156);
INSERT INTO `quota_data` VALUES (698, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776531600, 3163487, 90, 40122);
INSERT INTO `quota_data` VALUES (699, 34, 'lonesea', 'claude-opus-4-6', 1776531600, 728246, 25, 982938);
INSERT INTO `quota_data` VALUES (700, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776531600, 379282, 5, 428254);
INSERT INTO `quota_data` VALUES (701, 2, 'yangshuo1281', 'gpt-5.4', 1776531600, 2487523, 31, 176333);
INSERT INTO `quota_data` VALUES (702, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776531600, 182850, 4, 4947);
INSERT INTO `quota_data` VALUES (703, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776531600, 171393, 1, 192948);
INSERT INTO `quota_data` VALUES (704, 34, 'lonesea', 'claude-opus-4-6', 1776535200, 2001962, 37, 2663332);
INSERT INTO `quota_data` VALUES (705, 2, 'yangshuo1281', 'gpt-5.4', 1776535200, 2239485, 27, 200592);
INSERT INTO `quota_data` VALUES (706, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776535200, 158590, 3, 302436);
INSERT INTO `quota_data` VALUES (707, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776535200, 112110, 1, 1402);
INSERT INTO `quota_data` VALUES (708, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776535200, 184692, 4, 5026);
INSERT INTO `quota_data` VALUES (709, 34, 'lonesea', 'claude-opus-4-6', 1776538800, 1034361, 17, 1268470);
INSERT INTO `quota_data` VALUES (710, 2, 'yangshuo1281', 'gpt-5.4', 1776538800, 1985394, 22, 194647);
INSERT INTO `quota_data` VALUES (711, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776538800, 186569, 4, 5071);
INSERT INTO `quota_data` VALUES (712, 34, 'lonesea', 'claude-opus-4-6', 1776542400, 658891, 10, 811765);
INSERT INTO `quota_data` VALUES (713, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776542400, 188408, 4, 15658);
INSERT INTO `quota_data` VALUES (714, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776542400, 171537, 1, 193146);
INSERT INTO `quota_data` VALUES (715, 34, 'lonesea', 'claude-opus-4-6', 1776546000, 904914, 9, 1053763);
INSERT INTO `quota_data` VALUES (716, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776546000, 190241, 4, 5153);
INSERT INTO `quota_data` VALUES (717, 34, 'lonesea', 'claude-opus-4-6', 1776549600, 828917, 13, 1005491);
INSERT INTO `quota_data` VALUES (718, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776549600, 192096, 4, 15964);
INSERT INTO `quota_data` VALUES (719, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776553200, 720515, 8, 917820);
INSERT INTO `quota_data` VALUES (720, 34, 'lonesea', 'claude-opus-4-6', 1776553200, 653569, 10, 843096);
INSERT INTO `quota_data` VALUES (721, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776553200, 193966, 4, 5227);
INSERT INTO `quota_data` VALUES (722, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776556800, 1814494, 64, 2708618);
INSERT INTO `quota_data` VALUES (723, 34, 'lonesea', 'claude-opus-4-6', 1776556800, 1407325, 22, 1872042);
INSERT INTO `quota_data` VALUES (724, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776556800, 112110, 1, 1402);
INSERT INTO `quota_data` VALUES (725, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776556800, 195862, 4, 5268);
INSERT INTO `quota_data` VALUES (726, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776560400, 113743, 9, 262981);
INSERT INTO `quota_data` VALUES (727, 34, 'lonesea', 'claude-opus-4-6', 1776560400, 1492840, 29, 1910224);
INSERT INTO `quota_data` VALUES (728, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776560400, 197710, 4, 5297);
INSERT INTO `quota_data` VALUES (729, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776560400, 3266982, 40, 4228648);
INSERT INTO `quota_data` VALUES (730, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776564000, 3604467, 42, 4515701);
INSERT INTO `quota_data` VALUES (731, 34, 'lonesea', 'claude-opus-4-6', 1776564000, 2980003, 139, 5020137);
INSERT INTO `quota_data` VALUES (732, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776564000, 199558, 4, 5355);
INSERT INTO `quota_data` VALUES (733, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776564000, 187947, 2, 212223);
INSERT INTO `quota_data` VALUES (734, 34, 'lonesea', 'claude-opus-4-6', 1776567600, 2778822, 78, 3795328);
INSERT INTO `quota_data` VALUES (735, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776567600, 201406, 4, 5386);
INSERT INTO `quota_data` VALUES (736, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776567600, 3387328, 72, 4393438);
INSERT INTO `quota_data` VALUES (737, 2, 'yangshuo1281', 'gpt-5.4', 1776571200, 132836, 13, 18633);
INSERT INTO `quota_data` VALUES (738, 34, 'lonesea', 'claude-opus-4-6', 1776571200, 4115904, 88, 5581778);
INSERT INTO `quota_data` VALUES (739, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776571200, 627286, 17, 843786);
INSERT INTO `quota_data` VALUES (740, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776571200, 203254, 4, 5446);
INSERT INTO `quota_data` VALUES (741, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776571200, 522711, 20, 6595);
INSERT INTO `quota_data` VALUES (742, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776574800, 7799517, 102, 98078);
INSERT INTO `quota_data` VALUES (743, 34, 'lonesea', 'claude-opus-4-6', 1776574800, 2285300, 87, 5350828);
INSERT INTO `quota_data` VALUES (744, 2, 'yangshuo1281', 'gpt-5.4', 1776574800, 37328, 3, 7315);
INSERT INTO `quota_data` VALUES (745, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776574800, 1136860, 46, 2083846);
INSERT INTO `quota_data` VALUES (746, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776574800, 1353262, 65, 2295254);
INSERT INTO `quota_data` VALUES (747, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776574800, 205102, 4, 5504);
INSERT INTO `quota_data` VALUES (748, 34, 'lonesea', 'claude-opus-4-6', 1776578400, 1984457, 46, 2778433);
INSERT INTO `quota_data` VALUES (749, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776578400, 1853812, 50, 2567144);
INSERT INTO `quota_data` VALUES (750, 1, '532570043', 'gemini-3.1-pro', 1776578400, 374, 2, 2224);
INSERT INTO `quota_data` VALUES (751, 1, '532570043', 'gemini-3.1-pro-low', 1776578400, 385, 2, 2290);
INSERT INTO `quota_data` VALUES (752, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776578400, 7642334, 116, 96226);
INSERT INTO `quota_data` VALUES (753, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776578400, 1809336, 118, 3367058);
INSERT INTO `quota_data` VALUES (754, 1, '532570043', 'gemini-3-flash', 1776578400, 150, 2, 220);
INSERT INTO `quota_data` VALUES (755, 1, '532570043', 'gemini-2.5-flash', 1776578400, 111, 2, 135);
INSERT INTO `quota_data` VALUES (756, 1, '532570043', 'gemini-3.1-pro-high', 1776578400, 382, 2, 2272);
INSERT INTO `quota_data` VALUES (757, 1, '532570043', 'gemini-2.5-flash-lite', 1776578400, 127, 2, 25);
INSERT INTO `quota_data` VALUES (758, 1, '532570043', 'gemini-3-pro-preview', 1776578400, 191, 1, 1136);
INSERT INTO `quota_data` VALUES (759, 1, '532570043', 'gemini-3-flash-preview', 1776578400, 52, 1, 76);
INSERT INTO `quota_data` VALUES (760, 1, '532570043', 'gemini-3.1-pro-preview', 1776578400, 184, 1, 1094);
INSERT INTO `quota_data` VALUES (761, 1, '532570043', 'gemini-3.1-flash-lite-preview', 1776578400, 85, 1, 63);
INSERT INTO `quota_data` VALUES (762, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776578400, 206959, 4, 5547);
INSERT INTO `quota_data` VALUES (763, 1, '532570043', 'gpt-5.4', 1776578400, 4312321, 16, 179415);
INSERT INTO `quota_data` VALUES (764, 2, 'yangshuo1281', 'gpt-5.4', 1776578400, 674212, 27, 65187);
INSERT INTO `quota_data` VALUES (765, 53, 'kuangquan', 'gpt-5.4', 1776578400, 43204, 5, 7006);
INSERT INTO `quota_data` VALUES (766, 34, 'lonesea', 'gemini-3-flash', 1776578400, 75, 1, 28);
INSERT INTO `quota_data` VALUES (767, 34, 'lonesea', 'gemini-3-pro-preview', 1776578400, 184, 1, 274);
INSERT INTO `quota_data` VALUES (768, 34, 'lonesea', 'gemini-3.1-pro-preview', 1776578400, 197, 1, 293);
INSERT INTO `quota_data` VALUES (769, 34, 'lonesea', 'gemini-3-flash-preview', 1776578400, 52, 1, 19);
INSERT INTO `quota_data` VALUES (770, 34, 'lonesea', 'gemini-3.1-flash-lite-preview', 1776578400, 63, 1, 12);
INSERT INTO `quota_data` VALUES (771, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776582000, 5174441, 71, 64998);
INSERT INTO `quota_data` VALUES (772, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776582000, 4964731, 177, 6985453);
INSERT INTO `quota_data` VALUES (773, 53, 'kuangquan', 'gpt-5.4', 1776582000, 1456876, 66, 90421);
INSERT INTO `quota_data` VALUES (774, 34, 'lonesea', 'gemini-3.1-pro-low', 1776582000, 196, 1, 292);
INSERT INTO `quota_data` VALUES (775, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776582000, 2088966, 79, 2985612);
INSERT INTO `quota_data` VALUES (776, 34, 'lonesea', 'gemini-3.1-pro-high', 1776582000, 209, 1, 311);
INSERT INTO `quota_data` VALUES (777, 34, 'lonesea', 'gemini-3.1-pro-preview', 1776582000, 173, 1, 257);
INSERT INTO `quota_data` VALUES (778, 1, '532570043', 'gemini-3.1-flash-image-preview', 1776582000, 11, 1, 75000);
INSERT INTO `quota_data` VALUES (779, 1, '532570043', 'gemini-3.1-flash-image', 1776582000, 11, 1, 75000);
INSERT INTO `quota_data` VALUES (780, 34, 'lonesea', 'claude-opus-4-6', 1776582000, 1305492, 12, 1554418);
INSERT INTO `quota_data` VALUES (781, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776582000, 208811, 4, 5611);
INSERT INTO `quota_data` VALUES (782, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776585600, 2784028, 156, 4592634);
INSERT INTO `quota_data` VALUES (783, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776585600, 3975737, 61, 50210);
INSERT INTO `quota_data` VALUES (784, 34, 'lonesea', 'claude-opus-4-6', 1776585600, 3998557, 53, 5226190);
INSERT INTO `quota_data` VALUES (785, 53, 'kuangquan', 'gpt-5.4', 1776585600, 2525939, 68, 134790);
INSERT INTO `quota_data` VALUES (786, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776585600, 210653, 4, 5632);
INSERT INTO `quota_data` VALUES (787, 1, '532570043', 'claude-opus-4-6', 1776585600, 48, 2, 440);
INSERT INTO `quota_data` VALUES (788, 1, '532570043', 'gpt-5.4', 1776585600, 3557199, 13, 158401);
INSERT INTO `quota_data` VALUES (789, 2, 'yangshuo1281', 'gpt-5.4', 1776585600, 242029, 9, 23191);
INSERT INTO `quota_data` VALUES (790, 2, 'yangshuo1281', 'gpt-5.4', 1776589200, 1715354, 43, 94133);
INSERT INTO `quota_data` VALUES (791, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776589200, 3667041, 45, 46111);
INSERT INTO `quota_data` VALUES (792, 53, 'kuangquan', 'gpt-5.4', 1776589200, 2517133, 58, 114184);
INSERT INTO `quota_data` VALUES (793, 34, 'lonesea', 'claude-opus-4-6', 1776589200, 1885065, 86, 3856224);
INSERT INTO `quota_data` VALUES (794, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776589200, 1906164, 141, 3747397);
INSERT INTO `quota_data` VALUES (795, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776589200, 212523, 4, 5782);
INSERT INTO `quota_data` VALUES (796, 34, 'lonesea', 'claude-opus-4-6', 1776592800, 1762123, 70, 2826864);
INSERT INTO `quota_data` VALUES (797, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776592800, 1068294, 30, 13565);
INSERT INTO `quota_data` VALUES (798, 53, 'kuangquan', 'gpt-5.4', 1776592800, 861583, 14, 64012);
INSERT INTO `quota_data` VALUES (799, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776592800, 214355, 4, 5760);
INSERT INTO `quota_data` VALUES (800, 1, '532570043', 'gpt-5.4', 1776592800, 6277108, 22, 257386);
INSERT INTO `quota_data` VALUES (801, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776596400, 2698116, 39, 34110);
INSERT INTO `quota_data` VALUES (802, 53, 'kuangquan', 'gpt-5.4', 1776596400, 964266, 43, 56733);
INSERT INTO `quota_data` VALUES (803, 34, 'lonesea', 'claude-opus-4-6', 1776596400, 1812467, 74, 2733516);
INSERT INTO `quota_data` VALUES (804, 2, 'yangshuo1281', 'gpt-5.4', 1776596400, 166756, 8, 20775);
INSERT INTO `quota_data` VALUES (805, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776596400, 216190, 4, 5769);
INSERT INTO `quota_data` VALUES (806, 1, '532570043', 'gpt-5.4', 1776596400, 4723879, 16, 193234);
INSERT INTO `quota_data` VALUES (807, 34, 'lonesea', 'claude-opus-4-6', 1776600000, 1502386, 15, 1710620);
INSERT INTO `quota_data` VALUES (808, 53, 'kuangquan', 'gpt-5.4', 1776600000, 790046, 18, 43856);
INSERT INTO `quota_data` VALUES (809, 1, '532570043', 'gpt-5.4', 1776600000, 1376029, 21, 84142);
INSERT INTO `quota_data` VALUES (810, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776600000, 218065, 4, 5897);
INSERT INTO `quota_data` VALUES (811, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776600000, 494394, 6, 6201);
INSERT INTO `quota_data` VALUES (812, 34, 'lonesea', 'claude-opus-4-6', 1776603600, 2494769, 80, 3663533);
INSERT INTO `quota_data` VALUES (813, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776603600, 219886, 4, 5859);
INSERT INTO `quota_data` VALUES (814, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776603600, 413288, 5, 5179);
INSERT INTO `quota_data` VALUES (815, 4, 'RaphaelLcs', 'gpt-5.4', 1776603600, 20, 1, 21);
INSERT INTO `quota_data` VALUES (816, 1, '532570043', 'gpt-5.4', 1776603600, 1468382, 13, 73452);
INSERT INTO `quota_data` VALUES (817, 34, 'lonesea', 'claude-sonnet-4-6', 1776603600, 1381, 1, 935);
INSERT INTO `quota_data` VALUES (818, 34, 'lonesea', 'claude-opus-4-6', 1776607200, 1973267, 112, 3269830);
INSERT INTO `quota_data` VALUES (819, 53, 'kuangquan', 'gpt-5.4', 1776607200, 810793, 31, 54964);
INSERT INTO `quota_data` VALUES (820, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776607200, 221734, 4, 18302);
INSERT INTO `quota_data` VALUES (821, 1, '532570043', 'gpt-5.4', 1776607200, 2798102, 20, 115535);
INSERT INTO `quota_data` VALUES (822, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776607200, 313333, 3, 3919);
INSERT INTO `quota_data` VALUES (823, 53, 'kuangquan', 'gpt-5.4', 1776610800, 349925, 14, 14618);
INSERT INTO `quota_data` VALUES (824, 34, 'lonesea', 'claude-opus-4-6', 1776610800, 1318919, 43, 1806406);
INSERT INTO `quota_data` VALUES (825, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776610800, 1669354, 23, 20984);
INSERT INTO `quota_data` VALUES (826, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776610800, 223582, 4, 18447);
INSERT INTO `quota_data` VALUES (827, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776610800, 101419, 10, 170636);
INSERT INTO `quota_data` VALUES (828, 53, 'kuangquan', 'gpt-5.4', 1776614400, 1140580, 47, 62312);
INSERT INTO `quota_data` VALUES (829, 34, 'lonesea', 'claude-opus-4-6', 1776614400, 968076, 15, 1193312);
INSERT INTO `quota_data` VALUES (830, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776614400, 29090, 2, 33640);
INSERT INTO `quota_data` VALUES (831, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776614400, 4661222, 87, 58970);
INSERT INTO `quota_data` VALUES (832, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776614400, 225430, 4, 5977);
INSERT INTO `quota_data` VALUES (833, 53, 'kuangquan', 'gpt-5.4', 1776618000, 728199, 18, 36432);
INSERT INTO `quota_data` VALUES (834, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776618000, 4805812, 50, 60481);
INSERT INTO `quota_data` VALUES (835, 34, 'lonesea', 'claude-opus-4-6', 1776618000, 1453565, 21, 1836467);
INSERT INTO `quota_data` VALUES (836, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776618000, 227288, 4, 6109);
INSERT INTO `quota_data` VALUES (837, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776621600, 482324, 12, 6100);
INSERT INTO `quota_data` VALUES (838, 34, 'lonesea', 'claude-opus-4-6', 1776621600, 627873, 7, 829361);
INSERT INTO `quota_data` VALUES (839, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776621600, 229126, 4, 6096);
INSERT INTO `quota_data` VALUES (840, 2, 'yangshuo1281', 'gpt-5.4', 1776621600, 34844, 3, 4555);
INSERT INTO `quota_data` VALUES (841, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776621600, 100943, 2, 118327);
INSERT INTO `quota_data` VALUES (842, 34, 'lonesea', 'claude-opus-4-6', 1776625200, 717783, 8, 889957);
INSERT INTO `quota_data` VALUES (843, 53, 'kuangquan', 'gpt-5.4', 1776625200, 117937, 8, 22502);
INSERT INTO `quota_data` VALUES (844, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776625200, 115256, 2, 3048);
INSERT INTO `quota_data` VALUES (845, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776625200, 2504371, 80, 3526786);
INSERT INTO `quota_data` VALUES (846, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776628800, 231922, 4, 6248);
INSERT INTO `quota_data` VALUES (847, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776628800, 1150946, 74, 1897958);
INSERT INTO `quota_data` VALUES (848, 34, 'lonesea', 'claude-opus-4-6', 1776628800, 953105, 5, 1113181);
INSERT INTO `quota_data` VALUES (849, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776632400, 2314017, 145, 4202571);
INSERT INTO `quota_data` VALUES (850, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776632400, 233746, 4, 6213);
INSERT INTO `quota_data` VALUES (851, 34, 'lonesea', 'claude-opus-4-6', 1776632400, 1008541, 14, 1236478);
INSERT INTO `quota_data` VALUES (852, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776636000, 152441, 8, 303301);
INSERT INTO `quota_data` VALUES (853, 34, 'lonesea', 'claude-opus-4-6', 1776636000, 769705, 10, 961004);
INSERT INTO `quota_data` VALUES (854, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776636000, 235594, 4, 6244);
INSERT INTO `quota_data` VALUES (855, 53, 'kuangquan', 'gpt-5.4', 1776636000, 235611, 10, 23405);
INSERT INTO `quota_data` VALUES (856, 53, 'kuangquan', 'gpt-5.4', 1776639600, 1332763, 26, 73543);
INSERT INTO `quota_data` VALUES (857, 34, 'lonesea', 'claude-opus-4-6', 1776639600, 839758, 14, 1044116);
INSERT INTO `quota_data` VALUES (858, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776639600, 237442, 4, 6303);
INSERT INTO `quota_data` VALUES (859, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776643200, 170930, 4, 219120);
INSERT INTO `quota_data` VALUES (860, 53, 'kuangquan', 'gpt-5.4', 1776643200, 2229949, 28, 171219);
INSERT INTO `quota_data` VALUES (861, 34, 'lonesea', 'claude-opus-4-6', 1776643200, 568993, 9, 686461);
INSERT INTO `quota_data` VALUES (862, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776643200, 244753, 4, 3080);
INSERT INTO `quota_data` VALUES (863, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776643200, 239301, 4, 6349);
INSERT INTO `quota_data` VALUES (864, 53, 'kuangquan', 'gpt-5.4', 1776646800, 927609, 14, 47869);
INSERT INTO `quota_data` VALUES (865, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776646800, 2331250, 43, 29746);
INSERT INTO `quota_data` VALUES (866, 34, 'lonesea', 'claude-opus-4-6', 1776646800, 3830832, 48, 5442951);
INSERT INTO `quota_data` VALUES (867, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776646800, 241138, 4, 6390);
INSERT INTO `quota_data` VALUES (868, 1, '532570043', 'gpt-5.4', 1776646800, 1059658, 7, 93327);
INSERT INTO `quota_data` VALUES (869, 34, 'lonesea', 'claude-opus-4-6', 1776650400, 18319706, 123, 23560110);
INSERT INTO `quota_data` VALUES (870, 53, 'kuangquan', 'gpt-5.4', 1776650400, 1288919, 15, 47580);
INSERT INTO `quota_data` VALUES (871, 1, '532570043', 'claude-sonnet-4-6', 1776650400, 416, 1, 720);
INSERT INTO `quota_data` VALUES (872, 1, '532570043', 'claude-opus-4-5', 1776650400, 828, 2, 2390);
INSERT INTO `quota_data` VALUES (873, 1, '532570043', 'gpt-5.4', 1776650400, 5364891, 37, 226033);
INSERT INTO `quota_data` VALUES (874, 1, '532570043', 'claude-opus-4-6', 1776650400, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (875, 1, '532570043', 'claude-opus-4-6-thinking', 1776650400, 985, 2, 3773);
INSERT INTO `quota_data` VALUES (876, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776650400, 242997, 4, 20088);
INSERT INTO `quota_data` VALUES (877, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776650400, 3136193, 40, 39458);
INSERT INTO `quota_data` VALUES (878, 1, '532570043', 'gpt-5.4', 1776654000, 4505822, 29, 230611);
INSERT INTO `quota_data` VALUES (879, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776654000, 4695165, 136, 6346723);
INSERT INTO `quota_data` VALUES (880, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776654000, 2043867, 31, 25679);
INSERT INTO `quota_data` VALUES (881, 34, 'lonesea', 'claude-opus-4-6', 1776654000, 32917746, 392, 42869022);
INSERT INTO `quota_data` VALUES (882, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776654000, 244847, 4, 20208);
INSERT INTO `quota_data` VALUES (883, 53, 'kuangquan', 'gpt-5.4', 1776654000, 379709, 4, 19975);
INSERT INTO `quota_data` VALUES (884, 34, 'lonesea', 'claude-opus-4-6', 1776657600, 17751737, 217, 26678379);
INSERT INTO `quota_data` VALUES (885, 1, '532570043', 'gpt-5.2', 1776657600, 21, 1, 104);
INSERT INTO `quota_data` VALUES (886, 1, '532570043', 'gpt-5.4-thinking', 1776657600, 39, 1, 249);
INSERT INTO `quota_data` VALUES (887, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776657600, 246705, 4, 20369);
INSERT INTO `quota_data` VALUES (888, 1, '532570043', 'gpt-5.4', 1776657600, 4194466, 26, 160381);
INSERT INTO `quota_data` VALUES (889, 1, '532570043', 'gpt-5.3-codex', 1776657600, 20, 1, 97);
INSERT INTO `quota_data` VALUES (890, 1, '532570043', 'gpt-5.4-mini', 1776657600, 20, 1, 32);
INSERT INTO `quota_data` VALUES (891, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776657600, 98007, 1, 111977);
INSERT INTO `quota_data` VALUES (892, 1, '532570043', 'deepseek-3.2', 1776657600, 15, 1, 3);
INSERT INTO `quota_data` VALUES (893, 1, '532570043', 'deepseek-3.2-thinking', 1776657600, 129, 1, 29);
INSERT INTO `quota_data` VALUES (894, 34, 'lonesea', 'claude-opus-4-6', 1776661200, 6013291, 136, 9254076);
INSERT INTO `quota_data` VALUES (895, 1, '532570043', 'gpt-5.4', 1776661200, 1974788, 11, 102731);
INSERT INTO `quota_data` VALUES (896, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776661200, 248554, 4, 34426);
INSERT INTO `quota_data` VALUES (897, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776661200, 408485, 14, 5185);
INSERT INTO `quota_data` VALUES (898, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776661200, 874538, 37, 1272491);
INSERT INTO `quota_data` VALUES (899, 2, 'yangshuo1281', 'gpt-5.4', 1776661200, 813399, 10, 69525);
INSERT INTO `quota_data` VALUES (900, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776664800, 963678, 52, 1466542);
INSERT INTO `quota_data` VALUES (901, 34, 'lonesea', 'claude-opus-4-6', 1776664800, 16079951, 354, 23381436);
INSERT INTO `quota_data` VALUES (902, 2, 'yangshuo1281', 'gpt-5.4', 1776664800, 363547, 14, 24488);
INSERT INTO `quota_data` VALUES (903, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776664800, 2905716, 59, 36897);
INSERT INTO `quota_data` VALUES (904, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776664800, 250389, 4, 34666);
INSERT INTO `quota_data` VALUES (905, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776668400, 3718111, 122, 5277280);
INSERT INTO `quota_data` VALUES (906, 34, 'lonesea', 'claude-opus-4-6', 1776668400, 21389526, 415, 31766728);
INSERT INTO `quota_data` VALUES (907, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776668400, 5060353, 84, 64020);
INSERT INTO `quota_data` VALUES (908, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776668400, 252226, 4, 34910);
INSERT INTO `quota_data` VALUES (909, 1, '532570043', 'gpt-5.4', 1776668400, 2630309, 13, 119890);
INSERT INTO `quota_data` VALUES (910, 34, 'lonesea', 'claude-sonnet-4-6', 1776668400, 36, 1, 68);
INSERT INTO `quota_data` VALUES (911, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776672000, 4258569, 108, 53830);
INSERT INTO `quota_data` VALUES (912, 2, 'yangshuo1281', 'gpt-5.4', 1776672000, 15010, 2, 3496);
INSERT INTO `quota_data` VALUES (913, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776672000, 3704010, 100, 4983412);
INSERT INTO `quota_data` VALUES (914, 34, 'lonesea', 'claude-opus-4-6', 1776672000, 23329172, 842, 37843813);
INSERT INTO `quota_data` VALUES (915, 53, 'kuangquan', 'gpt-5.4', 1776672000, 949353, 39, 56578);
INSERT INTO `quota_data` VALUES (916, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776672000, 254087, 4, 35162);
INSERT INTO `quota_data` VALUES (917, 18, 'hmzhou', 'gpt-5.3-codex', 1776672000, 5951305, 37, 251011);
INSERT INTO `quota_data` VALUES (918, 1, '532570043', 'gpt-5.4', 1776672000, 2481051, 11, 170420);
INSERT INTO `quota_data` VALUES (919, 1, '532570043', 'deepseek-3.1-terminus', 1776672000, 23, 1, 4);
INSERT INTO `quota_data` VALUES (920, 34, 'lonesea', 'claude-sonnet-4-6', 1776672000, 690566, 156, 1481769);
INSERT INTO `quota_data` VALUES (921, 2, 'yangshuo1281', 'glm-5', 1776672000, 28795, 4, 1503);
INSERT INTO `quota_data` VALUES (922, 34, 'lonesea', 'claude-opus-4-6', 1776675600, 18724595, 399, 26993445);
INSERT INTO `quota_data` VALUES (923, 18, 'hmzhou', 'gpt-5.3-codex', 1776675600, 2412494, 46, 104619);
INSERT INTO `quota_data` VALUES (924, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776675600, 2905175, 66, 36791);
INSERT INTO `quota_data` VALUES (925, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776675600, 1361440, 28, 1765562);
INSERT INTO `quota_data` VALUES (926, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776675600, 255932, 4, 35447);
INSERT INTO `quota_data` VALUES (927, 2, 'yangshuo1281', 'gpt-5.4', 1776675600, 49095, 4, 7523);
INSERT INTO `quota_data` VALUES (928, 53, 'kuangquan', 'gpt-5.4', 1776675600, 297519, 8, 25471);
INSERT INTO `quota_data` VALUES (929, 34, 'lonesea', 'claude-sonnet-4-6', 1776675600, 888062, 65, 687190);
INSERT INTO `quota_data` VALUES (930, 34, 'lonesea', 'claude-opus-4-6', 1776679200, 11504742, 330, 17856975);
INSERT INTO `quota_data` VALUES (931, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776679200, 3481778, 81, 4547765);
INSERT INTO `quota_data` VALUES (932, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776679200, 2202223, 62, 27806);
INSERT INTO `quota_data` VALUES (933, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776679200, 257796, 4, 35702);
INSERT INTO `quota_data` VALUES (934, 2, 'yangshuo1281', 'glm-5', 1776679200, 63160, 2, 4149);
INSERT INTO `quota_data` VALUES (935, 53, 'kuangquan', 'gpt-5.4', 1776679200, 664822, 15, 42317);
INSERT INTO `quota_data` VALUES (936, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776682800, 362856, 21, 517803);
INSERT INTO `quota_data` VALUES (937, 34, 'lonesea', 'claude-opus-4-6', 1776682800, 9904272, 169, 14495322);
INSERT INTO `quota_data` VALUES (938, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776682800, 259631, 4, 21398);
INSERT INTO `quota_data` VALUES (939, 2, 'yangshuo1281', 'glm-5', 1776682800, 23689, 3, 1250);
INSERT INTO `quota_data` VALUES (940, 53, 'kuangquan', 'gpt-5.4', 1776682800, 448269, 10, 29366);
INSERT INTO `quota_data` VALUES (941, 34, 'lonesea', 'claude-opus-4-6', 1776686400, 6127678, 61, 7822488);
INSERT INTO `quota_data` VALUES (942, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776686400, 261478, 4, 21600);
INSERT INTO `quota_data` VALUES (943, 18, 'hmzhou', 'gpt-5.3-codex', 1776686400, 7780218, 62, 250215);
INSERT INTO `quota_data` VALUES (944, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776686400, 626444, 19, 866782);
INSERT INTO `quota_data` VALUES (945, 18, 'hmzhou', 'gpt-5.3-codex', 1776690000, 10332113, 85, 308867);
INSERT INTO `quota_data` VALUES (946, 34, 'lonesea', 'claude-opus-4-6', 1776690000, 2018395, 41, 2634386);
INSERT INTO `quota_data` VALUES (947, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776690000, 263325, 4, 36432);
INSERT INTO `quota_data` VALUES (948, 18, 'hmzhou', 'gpt-5.4-mini', 1776690000, 8784, 1, 292);
INSERT INTO `quota_data` VALUES (949, 1, '532570043', 'gpt-5.4', 1776690000, 1200205, 5, 87576);
INSERT INTO `quota_data` VALUES (950, 1, '532570043', 'gpt-5.4', 1776693600, 977764, 5, 82901);
INSERT INTO `quota_data` VALUES (951, 18, 'hmzhou', 'gpt-5.3-codex', 1776693600, 12210323, 109, 511015);
INSERT INTO `quota_data` VALUES (952, 34, 'lonesea', 'claude-opus-4-6', 1776693600, 2688416, 33, 3244306);
INSERT INTO `quota_data` VALUES (953, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776693600, 265175, 4, 36724);
INSERT INTO `quota_data` VALUES (954, 2, 'yangshuo1281', 'gpt-5.4', 1776693600, 604995, 27, 47950);
INSERT INTO `quota_data` VALUES (955, 1, '532570043', 'claude-opus-4-6', 1776693600, 678, 5, 2040);
INSERT INTO `quota_data` VALUES (956, 1, '532570043', 'gemini-3.1-pro-preview', 1776693600, 167, 2, 238);
INSERT INTO `quota_data` VALUES (957, 34, 'lonesea', 'claude-opus-4-6', 1776697200, 3000514, 62, 4289656);
INSERT INTO `quota_data` VALUES (958, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776697200, 267021, 4, 36952);
INSERT INTO `quota_data` VALUES (959, 18, 'hmzhou', 'gpt-5.3-codex', 1776697200, 12759065, 73, 476587);
INSERT INTO `quota_data` VALUES (960, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776697200, 50384, 8, 92774);
INSERT INTO `quota_data` VALUES (961, 34, 'lonesea', 'claude-opus-4-6', 1776700800, 1963680, 25, 2380393);
INSERT INTO `quota_data` VALUES (962, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776700800, 29148, 2, 33575);
INSERT INTO `quota_data` VALUES (963, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776700800, 268868, 4, 22148);
INSERT INTO `quota_data` VALUES (964, 34, 'lonesea', 'claude-opus-4-6', 1776704400, 1440317, 12, 1755207);
INSERT INTO `quota_data` VALUES (965, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776704400, 270706, 4, 7159);
INSERT INTO `quota_data` VALUES (966, 34, 'lonesea', 'claude-opus-4-6', 1776708000, 2476955, 49, 3525465);
INSERT INTO `quota_data` VALUES (967, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776708000, 272554, 4, 22453);
INSERT INTO `quota_data` VALUES (968, 53, 'kuangquan', 'gpt-5.4', 1776711600, 215344, 14, 23333);
INSERT INTO `quota_data` VALUES (969, 34, 'lonesea', 'claude-opus-4-6', 1776711600, 1275726, 13, 1574419);
INSERT INTO `quota_data` VALUES (970, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776711600, 274402, 4, 22540);
INSERT INTO `quota_data` VALUES (971, 34, 'lonesea', 'claude-opus-4-6', 1776715200, 1563153, 15, 1902993);
INSERT INTO `quota_data` VALUES (972, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776715200, 276250, 4, 7277);
INSERT INTO `quota_data` VALUES (973, 53, 'kuangquan', 'gpt-5.4', 1776715200, 23898, 2, 1820);
INSERT INTO `quota_data` VALUES (974, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776715200, 775244, 50, 1486361);
INSERT INTO `quota_data` VALUES (975, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776718800, 1496499, 70, 2532829);
INSERT INTO `quota_data` VALUES (976, 34, 'lonesea', 'claude-opus-4-6', 1776718800, 1994279, 45, 2880497);
INSERT INTO `quota_data` VALUES (977, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776718800, 278114, 4, 7303);
INSERT INTO `quota_data` VALUES (978, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776722400, 227758, 6, 308290);
INSERT INTO `quota_data` VALUES (979, 34, 'lonesea', 'claude-opus-4-6', 1776722400, 1976962, 18, 2432882);
INSERT INTO `quota_data` VALUES (980, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776722400, 279946, 4, 7367);
INSERT INTO `quota_data` VALUES (981, 34, 'lonesea', 'claude-opus-4-6', 1776726000, 1530374, 24, 1903371);
INSERT INTO `quota_data` VALUES (982, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776726000, 1832948, 96, 3387804);
INSERT INTO `quota_data` VALUES (983, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776726000, 140922, 2, 3749);
INSERT INTO `quota_data` VALUES (984, 34, 'lonesea', 'claude-opus-4-6', 1776729600, 2681847, 44, 4237873);
INSERT INTO `quota_data` VALUES (985, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776729600, 1810479, 72, 3059213);
INSERT INTO `quota_data` VALUES (986, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776729600, 283218, 4, 23340);
INSERT INTO `quota_data` VALUES (987, 53, 'kuangquan', 'gpt-5.4', 1776729600, 135637, 9, 18497);
INSERT INTO `quota_data` VALUES (988, 18, 'hmzhou', 'gpt-5.3-codex', 1776729600, 329730, 2, 32060);
INSERT INTO `quota_data` VALUES (989, 18, 'hmzhou', 'gpt-5.3-codex', 1776733200, 1707289, 10, 38323);
INSERT INTO `quota_data` VALUES (990, 34, 'lonesea', 'claude-opus-4-6', 1776733200, 4648540, 63, 6271856);
INSERT INTO `quota_data` VALUES (991, 53, 'kuangquan', 'gpt-5.4', 1776733200, 745066, 24, 63951);
INSERT INTO `quota_data` VALUES (992, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776733200, 285067, 4, 39471);
INSERT INTO `quota_data` VALUES (993, 62, 'david', 'claude-opus-4-6', 1776733200, 694, 5, 2090);
INSERT INTO `quota_data` VALUES (994, 62, 'david', 'claude-sonnet-4-6', 1776733200, 633, 5, 1048);
INSERT INTO `quota_data` VALUES (995, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776733200, 1273219, 144, 2144140);
INSERT INTO `quota_data` VALUES (996, 2, 'yangshuo1281', 'gpt-5.4', 1776733200, 391627, 9, 34392);
INSERT INTO `quota_data` VALUES (997, 34, 'lonesea', 'claude-opus-4-6', 1776736800, 4892953, 61, 6657279);
INSERT INTO `quota_data` VALUES (998, 18, 'hmzhou', 'gpt-5.3-codex', 1776736800, 938136, 5, 50769);
INSERT INTO `quota_data` VALUES (999, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776736800, 771568, 56, 1314081);
INSERT INTO `quota_data` VALUES (1000, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776736800, 286886, 4, 39658);
INSERT INTO `quota_data` VALUES (1001, 2, 'yangshuo1281', 'gpt-5.4', 1776736800, 22813, 2, 1206);
INSERT INTO `quota_data` VALUES (1002, 62, 'david', 'claude-opus-4-6', 1776736800, 93643, 15, 90848);
INSERT INTO `quota_data` VALUES (1003, 1, '532570043', 'claude-sonnet-4-6', 1776736800, 452, 2, 870);
INSERT INTO `quota_data` VALUES (1004, 1, '532570043', 'claude-opus-4-6', 1776736800, 450, 2, 1445);
INSERT INTO `quota_data` VALUES (1005, 1, '532570043', 'claude-opus-4-6-thinking', 1776736800, 596, 2, 2691);
INSERT INTO `quota_data` VALUES (1006, 1, '532570043', 'claude-opus-4-5', 1776736800, 414, 1, 1195);
INSERT INTO `quota_data` VALUES (1007, 1, '532570043', 'gemini-3.1-pro-high', 1776736800, 1422183, 5, 233239);
INSERT INTO `quota_data` VALUES (1008, 34, 'lonesea', 'claude-sonnet-4-6', 1776736800, 36, 1, 68);
INSERT INTO `quota_data` VALUES (1009, 53, 'kuangquan', 'gpt-5.4', 1776736800, 764899, 15, 52490);
INSERT INTO `quota_data` VALUES (1010, 62, 'david', 'claude-sonnet-4-6', 1776736800, 464642, 24, 299877);
INSERT INTO `quota_data` VALUES (1011, 62, 'david', 'claude-opus-4-6-thinking', 1776736800, 15070, 2, 13705);
INSERT INTO `quota_data` VALUES (1012, 62, 'david', 'gpt-5.4', 1776736800, 486, 2, 272);
INSERT INTO `quota_data` VALUES (1013, 1, '532570043', 'gemini-3.1-pro', 1776736800, 883911, 3, 90556);
INSERT INTO `quota_data` VALUES (1014, 62, 'david', 'claude-sonnet-4-6', 1776740400, 373331, 22, 241349);
INSERT INTO `quota_data` VALUES (1015, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776740400, 922234, 99, 1516243);
INSERT INTO `quota_data` VALUES (1016, 62, 'david', 'claude-opus-4-6', 1776740400, 609916, 33, 838664);
INSERT INTO `quota_data` VALUES (1017, 34, 'lonesea', 'claude-opus-4-6', 1776740400, 8865902, 311, 18064897);
INSERT INTO `quota_data` VALUES (1018, 1, '532570043', 'gemini-3.1-pro', 1776740400, 3907061, 13, 253155);
INSERT INTO `quota_data` VALUES (1019, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776740400, 216378, 3, 38000);
INSERT INTO `quota_data` VALUES (1020, 18, 'hmzhou', 'gpt-5.3-codex', 1776740400, 2474379, 28, 155558);
INSERT INTO `quota_data` VALUES (1021, 53, 'kuangquan', 'gpt-5.4', 1776740400, 62690, 1, 16083);
INSERT INTO `quota_data` VALUES (1022, 62, 'david', 'gpt-5.4', 1776740400, 751933, 21, 158141);
INSERT INTO `quota_data` VALUES (1023, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776740400, 225578, 19, 368031);
INSERT INTO `quota_data` VALUES (1024, 34, 'lonesea', 'claude-opus-4-6', 1776744000, 5063496, 63, 6818381);
INSERT INTO `quota_data` VALUES (1025, 62, 'david', 'claude-opus-4-6', 1776744000, 143140, 12, 262323);
INSERT INTO `quota_data` VALUES (1026, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776744000, 1021515, 102, 1926413);
INSERT INTO `quota_data` VALUES (1027, 1, '532570043', 'gemini-3.1-pro', 1776744000, 15277306, 46, 666003);
INSERT INTO `quota_data` VALUES (1028, 62, 'david', 'gpt-5.4', 1776744000, 3262508, 137, 178477);
INSERT INTO `quota_data` VALUES (1029, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776744000, 289695, 4, 40104);
INSERT INTO `quota_data` VALUES (1030, 53, 'kuangquan', 'gpt-5.4', 1776744000, 194389, 3, 20435);
INSERT INTO `quota_data` VALUES (1031, 18, 'hmzhou', 'gpt-5.3-codex', 1776744000, 520845, 6, 24522);
INSERT INTO `quota_data` VALUES (1032, 34, 'lonesea', 'gpt-5.2', 1776744000, 21, 1, 21);
INSERT INTO `quota_data` VALUES (1033, 34, 'lonesea', 'gpt-5.3-codex', 1776744000, 21, 1, 21);
INSERT INTO `quota_data` VALUES (1034, 34, 'lonesea', 'gpt-5.4', 1776744000, 18, 1, 18);
INSERT INTO `quota_data` VALUES (1035, 34, 'lonesea', 'gpt-5.4-thinking', 1776744000, 37, 1, 47);
INSERT INTO `quota_data` VALUES (1036, 62, 'david', 'claude-sonnet-4-6', 1776744000, 26607, 2, 22804);
INSERT INTO `quota_data` VALUES (1037, 34, 'lonesea', 'claude-opus-4-6', 1776747600, 3266484, 81, 4894059);
INSERT INTO `quota_data` VALUES (1038, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776747600, 887980, 117, 2488044);
INSERT INTO `quota_data` VALUES (1039, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776747600, 218544, 3, 38416);
INSERT INTO `quota_data` VALUES (1040, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776747600, 583224, 18, 7331);
INSERT INTO `quota_data` VALUES (1041, 18, 'hmzhou', 'gpt-5.3-codex', 1776747600, 614727, 6, 28728);
INSERT INTO `quota_data` VALUES (1042, 2, 'yangshuo1281', 'gpt-5.4', 1776747600, 88924, 7, 10017);
INSERT INTO `quota_data` VALUES (1043, 62, 'david', 'gpt-5.4', 1776747600, 385, 1, 175);
INSERT INTO `quota_data` VALUES (1044, 53, 'kuangquan', 'gpt-5.4', 1776747600, 552594, 8, 48074);
INSERT INTO `quota_data` VALUES (1045, 34, 'lonesea', 'claude-opus-4-6', 1776751200, 15519911, 295, 23292153);
INSERT INTO `quota_data` VALUES (1046, 53, 'kuangquan', 'gpt-5.4', 1776751200, 2940217, 58, 161598);
INSERT INTO `quota_data` VALUES (1047, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776751200, 292950, 4, 40484);
INSERT INTO `quota_data` VALUES (1048, 18, 'hmzhou', 'gpt-5.3-codex', 1776751200, 620295, 6, 29719);
INSERT INTO `quota_data` VALUES (1049, 62, 'david', 'claude-opus-4-6', 1776751200, 103932, 2, 122081);
INSERT INTO `quota_data` VALUES (1050, 62, 'david', 'gpt-5.4', 1776751200, 910582, 31, 160871);
INSERT INTO `quota_data` VALUES (1051, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776751200, 104151, 3, 146839);
INSERT INTO `quota_data` VALUES (1052, 53, 'kuangquan', 'gpt-5.4', 1776754800, 967560, 26, 95345);
INSERT INTO `quota_data` VALUES (1053, 34, 'lonesea', 'claude-opus-4-6', 1776754800, 18405114, 442, 28527483);
INSERT INTO `quota_data` VALUES (1054, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776754800, 294798, 4, 40744);
INSERT INTO `quota_data` VALUES (1055, 18, 'hmzhou', 'gpt-5.3-codex', 1776754800, 230014, 2, 21520);
INSERT INTO `quota_data` VALUES (1056, 62, 'david', 'gpt-5.4', 1776754800, 855, 3, 483);
INSERT INTO `quota_data` VALUES (1057, 62, 'david', 'claude-sonnet-4-6', 1776754800, 90235, 3, 47705);
INSERT INTO `quota_data` VALUES (1058, 1, '532570043', 'gemini-3.1-pro', 1776754800, 3169731, 9, 322595);
INSERT INTO `quota_data` VALUES (1059, 34, 'lonesea', 'claude-sonnet-4-6', 1776754800, 50246, 2, 34620);
INSERT INTO `quota_data` VALUES (1060, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776758400, 1009084, 36, 12825);
INSERT INTO `quota_data` VALUES (1061, 34, 'lonesea', 'claude-opus-4-6', 1776758400, 11338956, 339, 18937471);
INSERT INTO `quota_data` VALUES (1062, 1, '532570043', 'gemini-3.1-pro', 1776758400, 5361257, 15, 233704);
INSERT INTO `quota_data` VALUES (1063, 34, 'lonesea', 'claude-sonnet-4-6', 1776758400, 267009, 39, 279082);
INSERT INTO `quota_data` VALUES (1064, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776758400, 296646, 4, 41004);
INSERT INTO `quota_data` VALUES (1065, 53, 'kuangquan', 'gpt-5.4', 1776758400, 1611569, 51, 99055);
INSERT INTO `quota_data` VALUES (1066, 62, 'david', 'gpt-5.4', 1776758400, 748, 2, 331);
INSERT INTO `quota_data` VALUES (1067, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776758400, 127256, 9, 256101);
INSERT INTO `quota_data` VALUES (1068, 28, 'ars6868@163.com', 'glm-5', 1776758400, 15, 1, 2);
INSERT INTO `quota_data` VALUES (1069, 2, 'yangshuo1281', 'gpt-5.4', 1776758400, 358500, 13, 39087);
INSERT INTO `quota_data` VALUES (1070, 28, 'ars6868@163.com', 'glm-5-thinking', 1776758400, 128, 1, 20);
INSERT INTO `quota_data` VALUES (1071, 62, 'david', 'gpt-5.4', 1776762000, 1239, 4, 634);
INSERT INTO `quota_data` VALUES (1072, 34, 'lonesea', 'claude-opus-4-6', 1776762000, 16420122, 343, 23690625);
INSERT INTO `quota_data` VALUES (1073, 53, 'kuangquan', 'gpt-5.4', 1776762000, 1997977, 48, 158597);
INSERT INTO `quota_data` VALUES (1074, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776762000, 2435253, 59, 31068);
INSERT INTO `quota_data` VALUES (1075, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776762000, 298494, 4, 41235);
INSERT INTO `quota_data` VALUES (1076, 34, 'lonesea', 'gpt-5.4-mini', 1776762000, 20, 1, 6);
INSERT INTO `quota_data` VALUES (1077, 62, 'david', 'gemini-3.1-pro-high', 1776762000, 1618, 3, 1686);
INSERT INTO `quota_data` VALUES (1078, 62, 'david', 'claude-opus-4-6-thinking', 1776762000, 19783, 2, 19885);
INSERT INTO `quota_data` VALUES (1079, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776762000, 619010, 23, 918223);
INSERT INTO `quota_data` VALUES (1080, 34, 'lonesea', 'claude-opus-4-6', 1776765600, 16972994, 283, 26204278);
INSERT INTO `quota_data` VALUES (1081, 62, 'david', 'gpt-5.4', 1776765600, 30230, 3, 4410);
INSERT INTO `quota_data` VALUES (1082, 53, 'kuangquan', 'gpt-5.4', 1776765600, 1249584, 44, 90766);
INSERT INTO `quota_data` VALUES (1083, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776765600, 300400, 4, 41611);
INSERT INTO `quota_data` VALUES (1084, 62, 'david', 'claude-opus-4-6-thinking', 1776765600, 19848, 1, 17532);
INSERT INTO `quota_data` VALUES (1085, 62, 'david', 'claude-sonnet-4-6', 1776765600, 119508, 9, 90852);
INSERT INTO `quota_data` VALUES (1086, 62, 'david', 'claude-opus-4-6', 1776765600, 190605, 11, 187310);
INSERT INTO `quota_data` VALUES (1087, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776765600, 1402849, 42, 17715);
INSERT INTO `quota_data` VALUES (1088, 34, 'lonesea', 'claude-opus-4-6', 1776769200, 13390581, 300, 21728738);
INSERT INTO `quota_data` VALUES (1089, 62, 'david', 'claude-sonnet-4-6', 1776769200, 2367629, 185, 1999426);
INSERT INTO `quota_data` VALUES (1090, 62, 'david', 'claude-opus-4-6', 1776769200, 681068, 58, 963326);
INSERT INTO `quota_data` VALUES (1091, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776769200, 3870125, 79, 48734);
INSERT INTO `quota_data` VALUES (1092, 53, 'kuangquan', 'gpt-5.4', 1776769200, 2022294, 47, 95226);
INSERT INTO `quota_data` VALUES (1093, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776769200, 302409, 4, 41860);
INSERT INTO `quota_data` VALUES (1094, 62, 'david', 'claude-sonnet-4-6', 1776772800, 123378, 11, 124886);
INSERT INTO `quota_data` VALUES (1095, 62, 'david', 'claude-opus-4-6', 1776772800, 125535, 4, 158166);
INSERT INTO `quota_data` VALUES (1096, 34, 'lonesea', 'claude-opus-4-6', 1776772800, 10151729, 117, 13716633);
INSERT INTO `quota_data` VALUES (1097, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776772800, 2600243, 38, 32921);
INSERT INTO `quota_data` VALUES (1098, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776772800, 304231, 4, 42081);
INSERT INTO `quota_data` VALUES (1099, 53, 'kuangquan', 'gpt-5.4', 1776772800, 884243, 33, 55522);
INSERT INTO `quota_data` VALUES (1100, 2, 'yangshuo1281', 'glm-5', 1776772800, 1706258, 40, 87108);
INSERT INTO `quota_data` VALUES (1101, 34, 'lonesea', 'claude-opus-4-6', 1776776400, 1357639, 32, 1700908);
INSERT INTO `quota_data` VALUES (1102, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776776400, 566855, 17, 7136);
INSERT INTO `quota_data` VALUES (1103, 53, 'kuangquan', 'gpt-5.4', 1776776400, 1185302, 35, 91236);
INSERT INTO `quota_data` VALUES (1104, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776776400, 306066, 4, 42293);
INSERT INTO `quota_data` VALUES (1105, 2, 'yangshuo1281', 'glm-5', 1776776400, 67759, 3, 4720);
INSERT INTO `quota_data` VALUES (1106, 34, 'lonesea', 'claude-opus-4-6', 1776780000, 1299245, 25, 1752905);
INSERT INTO `quota_data` VALUES (1107, 53, 'kuangquan', 'gpt-5.4', 1776780000, 126152, 25, 13106);
INSERT INTO `quota_data` VALUES (1108, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776780000, 307926, 4, 42572);
INSERT INTO `quota_data` VALUES (1109, 28, 'ars6868@163.com', 'deepseek-3.2-thinking', 1776780000, 245, 1, 5);
INSERT INTO `quota_data` VALUES (1110, 1, '532570043', 'gemini-3.1-pro', 1776780000, 2638572, 7, 325787);
INSERT INTO `quota_data` VALUES (1111, 34, 'lonesea', 'claude-opus-4-6', 1776783600, 212937, 8, 276181);
INSERT INTO `quota_data` VALUES (1112, 72, 'yyzq', 'gemini-3-flash-preview', 1776783600, 4658228, 258, 390948);
INSERT INTO `quota_data` VALUES (1113, 72, 'yyzq', 'gemini-3-pro-preview', 1776783600, 3100409, 241, 1924556);
INSERT INTO `quota_data` VALUES (1114, 72, 'yyzq', 'gemini-3.1-pro-preview', 1776783600, 3250026, 148, 1099714);
INSERT INTO `quota_data` VALUES (1115, 53, 'kuangquan', 'gpt-5.4', 1776783600, 119849, 24, 10871);
INSERT INTO `quota_data` VALUES (1116, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776783600, 309762, 4, 42786);
INSERT INTO `quota_data` VALUES (1117, 72, 'yyzq', 'gemini-2.5-flash', 1776783600, 235083, 30, 44735);
INSERT INTO `quota_data` VALUES (1118, 72, 'yyzq', 'claude-sonnet-4-6', 1776783600, 66, 2, 90);
INSERT INTO `quota_data` VALUES (1119, 72, 'yyzq', 'claude-opus-4-6', 1776783600, 704650, 117, 661319);
INSERT INTO `quota_data` VALUES (1120, 72, 'yyzq', 'claude-opus-4-6-thinking', 1776783600, 313, 3, 855);
INSERT INTO `quota_data` VALUES (1121, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776783600, 49901, 11, 97441);
INSERT INTO `quota_data` VALUES (1122, 72, 'yyzq', 'gemini-2.5-flash', 1776787200, 353060, 29, 41193);
INSERT INTO `quota_data` VALUES (1123, 72, 'yyzq', 'gemini-3-pro-preview', 1776787200, 5299303, 434, 3233948);
INSERT INTO `quota_data` VALUES (1124, 72, 'yyzq', 'gemini-3.1-pro-preview', 1776787200, 4043153, 232, 1454910);
INSERT INTO `quota_data` VALUES (1125, 34, 'lonesea', 'claude-opus-4-6', 1776787200, 534224, 14, 663520);
INSERT INTO `quota_data` VALUES (1126, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776787200, 32199, 2, 37169);
INSERT INTO `quota_data` VALUES (1127, 53, 'kuangquan', 'gpt-5.4', 1776787200, 120297, 24, 11282);
INSERT INTO `quota_data` VALUES (1128, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776787200, 311667, 4, 43160);
INSERT INTO `quota_data` VALUES (1129, 5, 'fengpengzhengju1', 'claude-opus-4-6', 1776787200, 31, 1, 53);
INSERT INTO `quota_data` VALUES (1130, 72, 'yyzq', 'gemini-3-pro-preview', 1776790800, 1788348, 132, 1062634);
INSERT INTO `quota_data` VALUES (1131, 72, 'yyzq', 'gemini-2.5-flash', 1776790800, 317608, 29, 28473);
INSERT INTO `quota_data` VALUES (1132, 6, '1575376866@qq.com', 'claude-opus-4-6-thinking', 1776790800, 789957, 94, 1702909);
INSERT INTO `quota_data` VALUES (1133, 72, 'yyzq', 'gemini-3.1-pro-preview', 1776790800, 5157719, 550, 2297263);
INSERT INTO `quota_data` VALUES (1134, 53, 'kuangquan', 'gpt-5.4', 1776790800, 121001, 24, 11886);
INSERT INTO `quota_data` VALUES (1135, 3, 'al90slj23@gmail.com', 'gpt-5.4', 1776790800, 313653, 4, 43375);
INSERT INTO `quota_data` VALUES (1136, 34, 'lonesea', 'claude-opus-4-6', 1776790800, 1226282, 16, 1518431);
INSERT INTO `quota_data` VALUES (1137, 72, 'yyzq', 'gemini-3.1-pro-preview', 1776794400, 175034, 17, 65626);
INSERT INTO `quota_data` VALUES (1138, 72, 'yyzq', 'gemini-3-pro-preview', 1776794400, 12228, 1, 7993);
INSERT INTO `quota_data` VALUES (1139, 34, 'lonesea', 'claude-opus-4-6', 1776794400, 111172, 1, 125325);
INSERT INTO `quota_data` VALUES (1140, 72, 'yyzq', 'gemini-2.5-flash', 1776794400, 18917, 2, 4124);

-- ----------------------------
-- Table structure for redemptions
-- ----------------------------
DROP TABLE IF EXISTS `redemptions`;
CREATE TABLE `redemptions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL,
  `key` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` bigint NULL DEFAULT 1,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `quota` bigint NULL DEFAULT 100,
  `created_time` bigint NULL DEFAULT NULL,
  `redeemed_time` bigint NULL DEFAULT NULL,
  `used_user_id` bigint NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  `expired_time` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_redemptions_key`(`key` ASC) USING BTREE,
  INDEX `idx_redemptions_name`(`name` ASC) USING BTREE,
  INDEX `idx_redemptions_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of redemptions
-- ----------------------------

-- ----------------------------
-- Table structure for setups
-- ----------------------------
DROP TABLE IF EXISTS `setups`;
CREATE TABLE `setups`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `version` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `initialized_at` bigint NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of setups
-- ----------------------------
INSERT INTO `setups` VALUES (1, 'v0.12.6', 1775829583);

-- ----------------------------
-- Table structure for subscription_orders
-- ----------------------------
DROP TABLE IF EXISTS `subscription_orders`;
CREATE TABLE `subscription_orders`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL,
  `plan_id` bigint NULL DEFAULT NULL,
  `money` double NULL DEFAULT NULL,
  `trade_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `create_time` bigint NULL DEFAULT NULL,
  `complete_time` bigint NULL DEFAULT NULL,
  `provider_payload` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `trade_no`(`trade_no` ASC) USING BTREE,
  INDEX `idx_subscription_orders_plan_id`(`plan_id` ASC) USING BTREE,
  INDEX `idx_subscription_orders_trade_no`(`trade_no` ASC) USING BTREE,
  INDEX `idx_subscription_orders_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of subscription_orders
-- ----------------------------

-- ----------------------------
-- Table structure for subscription_plans
-- ----------------------------
DROP TABLE IF EXISTS `subscription_plans`;
CREATE TABLE `subscription_plans`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `subtitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `price_amount` decimal(10, 6) NOT NULL DEFAULT 0.000000,
  `currency` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'USD',
  `duration_unit` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'month',
  `duration_value` bigint NOT NULL DEFAULT 1,
  `custom_seconds` bigint NOT NULL DEFAULT 0,
  `enabled` tinyint(1) NULL DEFAULT 1,
  `sort_order` bigint NULL DEFAULT 0,
  `stripe_price_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `creem_product_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `max_purchase_per_user` bigint NULL DEFAULT 0,
  `upgrade_group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `total_amount` bigint NOT NULL DEFAULT 0,
  `quota_reset_period` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'never',
  `quota_reset_custom_seconds` bigint NULL DEFAULT 0,
  `created_at` bigint NULL DEFAULT NULL,
  `updated_at` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of subscription_plans
-- ----------------------------

-- ----------------------------
-- Table structure for subscription_pre_consume_records
-- ----------------------------
DROP TABLE IF EXISTS `subscription_pre_consume_records`;
CREATE TABLE `subscription_pre_consume_records`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `request_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `user_subscription_id` bigint NULL DEFAULT NULL,
  `pre_consumed` bigint NOT NULL DEFAULT 0,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_at` bigint NULL DEFAULT NULL,
  `updated_at` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_subscription_pre_consume_records_request_id`(`request_id` ASC) USING BTREE,
  INDEX `idx_subscription_pre_consume_records_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_subscription_pre_consume_records_user_subscription_id`(`user_subscription_id` ASC) USING BTREE,
  INDEX `idx_subscription_pre_consume_records_status`(`status` ASC) USING BTREE,
  INDEX `idx_subscription_pre_consume_records_updated_at`(`updated_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of subscription_pre_consume_records
-- ----------------------------

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` bigint NULL DEFAULT NULL,
  `updated_at` bigint NULL DEFAULT NULL,
  `task_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `platform` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `user_id` bigint NULL DEFAULT NULL,
  `group` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `channel_id` bigint NULL DEFAULT NULL,
  `quota` bigint NULL DEFAULT NULL,
  `action` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `fail_reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `submit_time` bigint NULL DEFAULT NULL,
  `start_time` bigint NULL DEFAULT NULL,
  `finish_time` bigint NULL DEFAULT NULL,
  `progress` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `properties` json NULL,
  `private_data` json NULL,
  `data` json NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_tasks_task_id`(`task_id` ASC) USING BTREE,
  INDEX `idx_tasks_channel_id`(`channel_id` ASC) USING BTREE,
  INDEX `idx_tasks_status`(`status` ASC) USING BTREE,
  INDEX `idx_tasks_submit_time`(`submit_time` ASC) USING BTREE,
  INDEX `idx_tasks_finish_time`(`finish_time` ASC) USING BTREE,
  INDEX `idx_tasks_progress`(`progress` ASC) USING BTREE,
  INDEX `idx_tasks_created_at`(`created_at` ASC) USING BTREE,
  INDEX `idx_tasks_platform`(`platform` ASC) USING BTREE,
  INDEX `idx_tasks_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_tasks_action`(`action` ASC) USING BTREE,
  INDEX `idx_tasks_start_time`(`start_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tasks
-- ----------------------------

-- ----------------------------
-- Table structure for tokens
-- ----------------------------
DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL,
  `key` char(48) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` bigint NULL DEFAULT 1,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `created_time` bigint NULL DEFAULT NULL,
  `accessed_time` bigint NULL DEFAULT NULL,
  `expired_time` bigint NULL DEFAULT -1,
  `remain_quota` bigint NULL DEFAULT 0,
  `unlimited_quota` tinyint(1) NULL DEFAULT NULL,
  `model_limits_enabled` tinyint(1) NULL DEFAULT NULL,
  `model_limits` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `allow_ips` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `used_quota` bigint NULL DEFAULT 0,
  `group` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `cross_group_retry` tinyint(1) NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `idx_tokens_key`(`key` ASC) USING BTREE,
  INDEX `idx_tokens_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_tokens_name`(`name` ASC) USING BTREE,
  INDEX `idx_tokens_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 72 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tokens
-- ----------------------------
INSERT INTO `tokens` VALUES (1, 1, 'vqGUX6e3wSRl1HIe2xlD6H1k0fR0ui7M3wi1tnu0noPAeXl4', 1, 'CC 反代渠道', 1775877838, 1776498018, -1, -178348691, 1, 0, '', '', 178348691, 'Claude|反代|特价', 0, NULL);
INSERT INTO `tokens` VALUES (2, 2, 'QwbZQDsT59UUbH9WC8om6GMZq4oXd0EPpVrhUVHlSaqFAZAf', 1, 'zhipu', 1775880676, 1776777760, 1810055146, -1258885, 1, 1, 'glm-5', '', 1950020, 'ZhiPu|自营', 0, NULL);
INSERT INTO `tokens` VALUES (3, 3, 'GNcd3fxixaiJSFbjjMy8lgM04BdNpea0ScDgEwkxTtlnsf09', 1, 'test：claudecode+claudeopus4.6', 1775887338, 1775939902, -1, -3448574, 1, 0, '', '', 3448574, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (4, 3, 'Zm21B2TNYhi7Emt6jepvcNoGYI6MmCSG9NN7TOcbLGkr0rUA', 1, 'test：openclaw+gpt54', 1775889065, 1776794728, -1, -2070657, 1, 0, '', '', 2070657, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (5, 4, 'vGyF79WbbY6TZ0NTgLf8eSHsqIjBS5N5jU4karLPfcl21kVZ', 1, 'ccswitch', 1775913243, 1775977751, -1, -49919342, 1, 0, '', '', 49919342, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (6, 6, 'NZ5rZh6rzRgqJs12xarIZ4Ny45RkyuIaWAGrahgMs4th4Iny', 1, 'claude-opus-4-6-thinking', 1775927015, 1776792245, -1, -111715179, 1, 0, '', '', 111715179, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (7, 6, 'aXDYEZ8iVaKYaBOxLwyrOk6Hjo1u28F9fzlA5SvPHmAsHJm6', 1, 'claude-sonnet-4-6', 1775927167, 1776281509, -1, -192702, 1, 0, '', '', 192702, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (8, 2, 'rIyJwz9ybq01EvegfCxYBRVVXwneS4W9Do1vCIH0WGg5YBWB', 1, 'gpt', 1775928504, 1776761183, 1841765129, -7258146, 1, 1, 'gpt-5.4', '', 7258146, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (9, 3, 'lZQfTAWVRUk2v0zS6NiEOtmOp3xiqf2Uvp2Xur568wBVVkP9', 1, 'test：opencode+claudeopus4.6', 1775936681, 1775965205, -1, -23835511, 1, 0, '', '', 23835511, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (10, 6, 'peNqg2X9nsNtCJ8v2qOYLLUqhaBiI1IFnIR5Q79Pc8JnLMYB', 1, 'claude-opus-4-6', 1775950578, 1776276067, -1, -9981783, 1, 0, '', '', 9981783, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (11, 3, '3IHlcislajBVmhXnapN998GAyMK1A3UgmohXA3Bju6qIxakw', 1, 'test：opencode+claudeopus4.6(反代.kiro)', 1775965578, 1775986465, -1, -22202680, 1, 0, '', '', 22202680, 'Claude|反代|特价', 0, NULL);
INSERT INTO `tokens` VALUES (12, 6, '4jnotayTRXYCsN4jwE9tissAPNXzka7tOe727V0HHUWHO7Th', 1, 'claude-opus-4-6-2.5', 1775967310, 1776025727, -1, -6672548, 1, 0, '', '', 6672548, 'Claude|反代|特价', 0, NULL);
INSERT INTO `tokens` VALUES (13, 10, '6e0ZPcUQ52fIxRbontRLeeyomk3VdxuqU30Fdpf5DExezeYT', 1, 'ailink_api', 1776020059, 1776020059, -1, 0, 1, 1, 'claude-sonnet-4-6-thinking,claude-opus-4-6-thinking,gpt-5.3-codex', '', 0, '', 0, NULL);
INSERT INTO `tokens` VALUES (14, 11, 'sWEQHokeof5Njom5M6vlnaQbAJhshHC9bch6na2ZDYnl27Fb', 1, 'OpenCode：OA-gpt5.4(反代自有.0.01)', 1776033007, 1776415675, -1, -3097190, 1, 0, '', '', 3097190, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (15, 11, 'MKurhmmbu2yO4WJ3cQuLZxHjIEZubUviV3p6QID3uYTe99fy', 1, 'OpenCode：CC-opus46(反代.KIRO.0.25x)', 1776033295, 1776136682, -1, -14836112, 1, 0, '', '', 14836112, 'Claude|反代|特价', 0, NULL);
INSERT INTO `tokens` VALUES (16, 5, 'W1bMDMzTbXgA80SCD38DmoSoU9gOc2mtVcKmD8yWGqrV3cB8', 1, 'beijingxing', 1776043602, 1776045623, -1, -3772, 1, 0, '', '', 3772, 'Claude|反代', 0, '2026-04-15 06:58:23.552');
INSERT INTO `tokens` VALUES (17, 11, 'NLuFjz1G2YgmmlFK4VgnKMir45BX2O1zsV7adluDLTCkWEK0', 1, 'OpenCode：CC-opus46(反代.反重力.0.45x)', 1776056328, 1776156822, -1, -36134720, 1, 0, '', '', 36134720, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (18, 11, 'r62WBqwlcAEBKVH3KcLOlvRuwYDvoQavZPiGt32tfIusqgx2', 1, 'kangbing', 1776061856, 1776216668, -1, -27826825, 1, 0, '', '', 27826825, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (19, 1, 'Ay5lp4DDVYmh1cmvTzg9KAepB6ElAmZqwovowjXqzTSNiUUN', 2, '测试', 1776147967, 1776398946, -1, 5000000000, 0, 0, '', '', 330982, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (20, 1, 'TShKOzrzfSva7UvTWLI38f1rdWruyijeh8dU1Y6bkuvygUWZ', 1, '测试官转', 1776148013, 1776398981, -1, 4073442, 0, 0, '', '', 926558, 'Claude|企业', 0, NULL);
INSERT INTO `tokens` VALUES (21, 16, 'QxSWKE4VfSlRDWj8HjJEU0xXJxJCrca1Ft976jDbu9283No6', 1, 'test', 1776154223, 1776242740, -1, -1427515, 1, 0, '', '', 1427515, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (22, 5, 'roC10KUZXHtBKR3kQJaYFoo0NJl97Mk6HIrMUe36vLvFhQYT', 1, 'genghang', 1776157782, 1776235395, -1, 4741105, 0, 0, '', '', 258895, 'Claude|反代', 0, '2026-04-15 06:58:23.552');
INSERT INTO `tokens` VALUES (23, 21, 'rpye5k7u8AgcsAcWhPmtseyrt1tHdAikegE7lRaXKeAfpeU7', 1, '01', 1776169977, 1776169977, -1, 0, 1, 0, '', '', 0, '', 0, NULL);
INSERT INTO `tokens` VALUES (24, 1, '5kV2mq76bWEwcEwFHRtYfw0Va3CpnML998i9ul1DYZn65YDx', 1, '测试 Aws', 1776226528, 1776258969, -1, 4992976, 0, 0, '', '', 7024, 'Claude|企业', 0, NULL);
INSERT INTO `tokens` VALUES (25, 1, 't15uda4oRNg01SHIQPkRCGXWaMLx4Wq2AP0Dfto8IXBUEHg2', 1, '测试GPT', 1776230340, 1776695353, -1, -11839313, 1, 0, '', '', 11839313, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (26, 5, '5GpLuGbP9JgcH60vboWSLXC6LWKieAYNYB8Ba3IvA5f9InGK', 1, 'kilo-tiaobanji', 1776233846, 1776235876, -1, 18806084, 0, 0, '', '', 6193916, 'Claude|反代', 0, '2026-04-15 06:58:23.552');
INSERT INTO `tokens` VALUES (27, 5, '4XaAOyKJ8HSOlXryflWfH6xwbEBXLTmsGd2IlAAoY5VweMPm', 1, 'alink-wsl', 1776235199, 1776242314, -1, -810992, 1, 0, '', '', 810992, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (28, 5, '0u7Bbr2n9gVwua9TRifAmxICJmtCZbpfXC9PydXBbeYxIDsl', 1, 'kilo-tiaobanji', 1776236336, 1776258279, -1, -7111301, 1, 0, '', '', 7111301, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (29, 22, 'f6A1Qb9bcpjtdWMbNFwmDMDMPg41q72ndZDB8WfFmbKI32cK', 1, 'oc', 1776238926, 1776524957, -1, -34984522, 1, 0, '', '', 34984522, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (30, 18, 'wDdkBxX8xtfxkTJZFnv1hGaKDTBB9KaxOfoAwQXwoufwQ0ew', 1, 'codex', 1776243458, 1776693644, -1, -1077382, 1, 0, '', '', 1077382, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (31, 23, 'VrWeZtyYrcdLz8SciEpT4hJ0JanhHfXHRKCCdcZuFK8xLew9', 1, 'zhuyalin', 1776243505, 1776243505, -1, 0, 1, 0, '', '', 0, '', 0, NULL);
INSERT INTO `tokens` VALUES (32, 5, 'udWAo59EFdomuV4Uh71lrCeP3yqFdXOIwomZamO3XLbBjfuG', 1, 'kilo-ins', 1776245552, 1776326870, -1, -11091955, 1, 0, '', '', 11091955, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (33, 5, '77dud496qP1slrqH0hjBBeXrqvLmDdLFPf2yOCiDmC8B2oC0', 1, 'ubuntu', 1776291494, 1776293149, -1, -96258, 1, 0, '', '', 96258, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (34, 5, 'HtCpdIRFwu8D4Ju5JnGdXJ00lA2loO9JUtR1K2qrafBQG8dQ', 1, 'codex-ubuntu', 1776319026, 1776410234, -1, -11867392, 1, 0, '', '', 11867392, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (35, 5, 'kSq3xAAUN2pz3CMWahxn3O5l6zL7adtRaTVTg7PY4pV835Eo', 1, 'cc-insp', 1776325102, 1776764092, -1, -90083639, 1, 0, '', '', 90083639, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (36, 28, 'tyjn28zmGBxECHhVlOFh5pJCxkx8xBUdHtomTQ1RysdX5PMJ', 1, 'key0416', 1776347506, 1776347506, -1, 0, 1, 0, '', '', 0, 'ZhiPu|自营', 0, NULL);
INSERT INTO `tokens` VALUES (37, 28, 'VpcL7s0bslJ9XMsLhs89dzk5dt1b2NEaETgdSCFWn7oPQ23b', 1, 'key0416-hrE03W', 1776347506, 1776350190, -1, -19994, 1, 0, '', '', 19994, 'ZhiPu|自营', 0, NULL);
INSERT INTO `tokens` VALUES (38, 1, 'Oerj16yO8ibKAEsxqRMCPgxvw4DPkIzoPmPWpBpDtJeFVwmn', 1, '测试智普', 1776349041, 1776350936, -1, -7860, 1, 0, '', '', 7860, 'ZhiPu|自营', 0, NULL);
INSERT INTO `tokens` VALUES (39, 30, 'NBLITkfuq4y0qgvLfMym6BoZUM61x3awrgd4KeSb0XhfyZg3', 1, 'test', 1776360679, 1776360679, -1, 0, 1, 0, '', '', 0, 'default', 0, NULL);
INSERT INTO `tokens` VALUES (40, 5, 'dH11mfDcvGoBB3HZp44HqJsrILD6NMwY9aYxq3TOikojJRsE', 1, 'cc-en-ins', 1776390818, 1776391031, -1, 5000000, 0, 0, '', '', 0, 'Claude|官转', 0, NULL);
INSERT INTO `tokens` VALUES (41, 28, 'qdK1MDh1yGBl8paIIl8ES1uZZZGs0pIh8EktlTeMJqcQirtd', 1, 'key0417', 1776392013, 1776774179, -1, -207595, 1, 0, '', '', 207595, 'DeepSeek|自营', 0, NULL);
INSERT INTO `tokens` VALUES (42, 34, '1VvvOMgEaks1gvWaq37Zz0eeH5iA8wcUeJN2IIRNuaKmREjT', 1, '反重力渠道 Claude 0.45x', 1776398122, 1776794753, -1, -834163200, 1, 0, '', '', 834163200, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (43, 28, '48YU4X658soSQHVcFB3mXC3FErpyVPDWzoVNdPLS5xD42KaY', 1, 'key0417cc', 1776406104, 1776780798, -1, -1226302, 1, 0, '', '', 1226302, 'DeepSeek|自营', 0, NULL);
INSERT INTO `tokens` VALUES (44, 11, 'bOg9l9ZbB8ILmGOULM9ojbcVZM4pMI9GmPQdJISxshQRnt78', 1, 'OpenCode：CC-opus46(反代按次.反重力.0.35x)', 1776426382, 1776500591, -1, -5302299, 1, 0, '', '', 5302299, 'Claude|反代|特价', 0, NULL);
INSERT INTO `tokens` VALUES (45, 5, 'SSpxjUgIwxNGHrvgmskyjJzCbgjGeZeuxnMCeaxJfFxKDjyP', 1, 'cc-tejia', 1776440983, 1776443049, -1, -929354, 1, 0, '', '', 929354, 'Claude|反代|特价', 0, NULL);
INSERT INTO `tokens` VALUES (46, 46, 'cz5hfmVjLUVg63dIpYUFyo1TBX6H4Ko8ztGKwXVM47nl3zVl', 1, '1', 1776451189, 1776451189, -1, 0, 1, 0, '', '', 0, 'Claude|企业', 0, NULL);
INSERT INTO `tokens` VALUES (47, 46, 'WAEBYBqxuaJFIcf71llSrh9n5tyUxtWESmKdqcz66Lg9P49z', 1, '1', 1776479105, 1776479105, -1, 0, 1, 0, '', '', 0, 'Claude|企业', 0, NULL);
INSERT INTO `tokens` VALUES (48, 6, 'mFB8YNB3Oro8GKgKNq4B0HyT9r9Vlet3T8aJKUVwriUB53fW', 1, 'liuqing138035', 1776494953, 1776495106, -1, -8, 1, 0, '', '', 8, 'Claude|反代|特价', 0, NULL);
INSERT INTO `tokens` VALUES (49, 53, '3RqkQt23jhpNIxs8kaF7oH5sq0ohPZMBJBjUMojSD8tLh0HL', 1, 'open claw', 1776580829, 1776794643, -1, -2379128, 1, 0, '', '', 2379128, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (50, 34, 'xKoze5sZUsY6TxVP8Nt9aTMWPzbEPtb1DvuVubJJLwjopLRa', 1, 'gemini', 1776581242, 1776582483, -1, -1486, 1, 0, '', '', 1486, 'Gemini|反代', 0, NULL);
INSERT INTO `tokens` VALUES (51, 4, 'nTcOw5L2SDmUPSxoKQESMz4qN12n90CjNMFA399wvUdpTbAG', 1, 'likedream', 1776588638, 1776588638, -1, 0, 1, 0, '', '', 0, 'JiMeng|多媒体', 0, NULL);
INSERT INTO `tokens` VALUES (52, 54, 'Jj8jlcbkCNXEpP5kkQFg3m4Xy3CXpiSVBVYrJncOWfOj2GjN', 1, 'sc-049862', 1776595021, 1776595021, -1, 100000000000, 1, 0, '', '', 0, '', 0, NULL);
INSERT INTO `tokens` VALUES (53, 4, 'vuAlywurKdQWkQFUx6ZoDNCWdUw0mwuillhk1jCMtYk0ICnu', 1, 'gpt-5.4', 1776602902, 1776605649, -1, -21, 1, 0, '', '', 21, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (54, 28, 'MxjRUhP7Dz7DBqrJNh4VtF1hgUlYRrcGZzEuFYsqFZJGqZ5e', 1, 'zaicc0420', 1776620681, 1776620681, -1, 0, 1, 0, '', '', 0, 'ZhiPu|自营', 0, NULL);
INSERT INTO `tokens` VALUES (55, 18, 'Svtp21YFuDo4Wwoc2V7jSgiH2ygQLWgVzFUuy7S9ZOcjhKQy', 1, 'codex-linux', 1776685951, 1776700360, -1, -1003328, 1, 0, '', '', 1003328, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (56, 18, 'KhgT2vg9pK8EXRsUZs87aGTxakaT1Bexw2CU2bkmvAximp8N', 1, 'codex-自己电脑', 1776690976, 1776756066, -1, -890573, 1, 0, '', '', 890573, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (57, 1, 'pEEnLsushu6drJI0eIzZjh0TlwkotbMAmtzfMmKMKBZHLV35', 1, '测试', 1776696210, 1776696384, -1, -2864, 1, 0, '', '', 2864, 'Gemini|反代', 0, '2026-04-20 14:47:39.020');
INSERT INTO `tokens` VALUES (58, 62, 'mTZr3EndaKn3osCcY42hB821twRqopudd5OCKRDV44YNorJ0', 1, 'test', 1776734058, 1776734159, -1, -3138, 1, 0, '', '', 3138, 'Claude|反代', 0, '2026-04-21 01:55:30.559');
INSERT INTO `tokens` VALUES (59, 62, 'RjpmiCj7UZ1QviY0batlOZz0x14VeQsI9fVBPk2iwevFc7Zx', 1, 'claude', 1776736816, 1776773173, -1, -5500739, 1, 0, '', '', 5500739, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (60, 62, 'VUM3xVBbrkCv8abJNKCSg93uxHU1N4DuVPSWaa2X7SRr0kae', 1, 'gemini', 1776736943, 1776763334, -1, -1686, 1, 0, '', '', 1686, 'Gemini|反代', 0, NULL);
INSERT INTO `tokens` VALUES (61, 62, 'emGzcyd6fvxApcIrwR6vPSGuNarwozBVxkRICoeX3E9Ex5QM', 1, 'openai', 1776736956, 1776768544, -1, -503794, 1, 0, '', '', 503794, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (62, 1, 'k11N5LemChNIR9fwRQOBxP8rT0WPyMSijUnY7E8o3hVZHDwK', 1, '测试Gemini', 1776737034, 1776781863, -1, -2125039, 1, 0, '', '', 2125039, 'Gemini|反代', 0, NULL);
INSERT INTO `tokens` VALUES (63, 34, 'fswfooM5NojzEafRiECucwSnxiRHvc8C8Ui26A2wjhItbkiI', 1, 'gpt', 1776746621, 1776762351, -1, -113, 1, 0, '', '', 113, 'Codex|自营', 0, NULL);
INSERT INTO `tokens` VALUES (64, 28, 'ztwE3uP1VFriSdGUNCZso1XmMtfYwBb5Qmi7JAfodTQ5OQyf', 1, 'zai0421', 1776755526, 1776760165, -1, -22, 1, 0, '', '', 22, 'ZhiPu|自营', 0, NULL);
INSERT INTO `tokens` VALUES (65, 28, '8MuQL5eHTrwCDB5uYeyMilGmdiLvUTs7U9g65SJyFsCzTft0', 1, 'qwenhermes', 1776757153, 1776757153, -1, 0, 1, 0, '', '', 0, 'Qwen|自营', 0, NULL);
INSERT INTO `tokens` VALUES (66, 28, 'OABGCNBBHYs3jvFWmR2Lh6pmxSqyARm989zXk8s7qNK9kn8O', 1, 'gtpkey', 1776774384, 1776774384, -1, 0, 1, 0, '', '', 0, 'Grok|自营', 0, NULL);
INSERT INTO `tokens` VALUES (67, 72, '4LV26hP3mQIyosfRJIgKXzUPBzG89idnZUXvyZcs8gLeVrfg', 1, 'nat gemini', 1776783331, 1776794798, -1, -11841146, 1, 0, '', '', 11841146, 'Gemini|反代', 0, NULL);
INSERT INTO `tokens` VALUES (68, 72, '69UuU77WooPHMrGJ36ZADpmKfRHoH4ZgDX03dbbtUvymRVzC', 1, '1', 1776783557, 1776783557, -1, 0, 1, 0, '', '', 0, 'Gemini|反代', 0, '2026-04-21 14:59:41.961');
INSERT INTO `tokens` VALUES (69, 72, 'TeruE8yGncDWJMCd7S5Y95QTn0ytVC3iH7FnTqxil3OTegTE', 1, 'ant c', 1776784300, 1776785850, -1, -662264, 1, 0, '', '', 662264, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (70, 5, '8qUCrAhccp20RrE5Jeqn75VuCQIv8gv22ypfGDjYoosb5u6V', 1, 'cc-test', 1776788814, 1776788894, -1, -53, 1, 0, '', '', 53, 'Claude|反代', 0, NULL);
INSERT INTO `tokens` VALUES (71, 72, 'bCI37nlziiKpIyR5BQbpHBfvWJCZldHe83rMaslmaojzEG7s', 1, 'codex', 1776789568, 1776789568, -1, 0, 1, 0, '', '', 0, 'Codex|自营', 0, NULL);

-- ----------------------------
-- Table structure for top_ups
-- ----------------------------
DROP TABLE IF EXISTS `top_ups`;
CREATE TABLE `top_ups`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL,
  `amount` bigint NULL DEFAULT NULL,
  `money` double NULL DEFAULT NULL,
  `trade_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `payment_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` bigint NULL DEFAULT NULL,
  `complete_time` bigint NULL DEFAULT NULL,
  `status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `trade_no`(`trade_no` ASC) USING BTREE,
  INDEX `idx_top_ups_trade_no`(`trade_no` ASC) USING BTREE,
  INDEX `idx_top_ups_user_id`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of top_ups
-- ----------------------------
INSERT INTO `top_ups` VALUES (1, 1, 20, 20, 'USR1NO0Fo7tc1776229879', 'wxpay', 1776229879, 0, 'pending');
INSERT INTO `top_ups` VALUES (2, 1, 20, 20, 'USR1NO1JwYKB1776229912', 'wxpay', 1776229912, 0, 'pending');
INSERT INTO `top_ups` VALUES (3, 18, 50, 50, 'USR18NOidGyoj1776241883', 'wxpay', 1776241883, 0, 'success');
INSERT INTO `top_ups` VALUES (4, 23, 20, 20, 'USR23NO8zCDKb1776243324', 'wxpay', 1776243324, 0, 'success');
INSERT INTO `top_ups` VALUES (5, 17, 20, 20, 'USR17NOCXkkTG1776250773', 'wxpay', 1776250773, 0, 'pending');
INSERT INTO `top_ups` VALUES (6, 24, 1000, 1000, 'USR24NOY4LLGh1776335586', 'wxpay', 1776335586, 1776335587, 'success');
INSERT INTO `top_ups` VALUES (7, 25, 500, 500, 'USR25NOq3asSN1776339322', 'wxpay', 1776339322, 1776339322, 'success');
INSERT INTO `top_ups` VALUES (8, 26, 500, 500, 'USR26NOiTGCFh1776344206', 'wxpay', 1776344206, 1776344211, 'success');
INSERT INTO `top_ups` VALUES (9, 27, 406, 406, 'USR27NOMT9tnq1776346704', 'wxpay', 1776346704, 1776346704, 'success');
INSERT INTO `top_ups` VALUES (10, 28, 20, 20, 'USR28NOa6NNNw1776347229', 'wxpay', 1776347229, 0, 'success');
INSERT INTO `top_ups` VALUES (11, 29, 2700, 2700, 'USR29NODW5bQU1776351268', 'wxpay', 1776351268, 0, 'pending');
INSERT INTO `top_ups` VALUES (12, 30, 1000, 1000, 'USR30NOzUvznv1776360680', 'wxpay', 1776360680, 0, 'pending');
INSERT INTO `top_ups` VALUES (13, 32, 1000, 1000, 'USR32NOz5cqdB1776386096', 'wxpay', 1776386096, 0, 'pending');
INSERT INTO `top_ups` VALUES (14, 17, 20, 20, 'USR17NOyEAVXz1776396041', 'wxpay', 1776396041, 0, 'pending');
INSERT INTO `top_ups` VALUES (15, 17, 20, 20, 'USR17NOcSIoMG1776420393', 'wxpay', 1776420393, 0, 'success');
INSERT INTO `top_ups` VALUES (16, 43, 20, 20, 'USR43NO84Y5d41776438684', 'wxpay', 1776438684, 0, 'pending');
INSERT INTO `top_ups` VALUES (17, 47, 40, 40, 'USR47NOhk8bOP1776480453', 'wxpay', 1776480453, 0, 'pending');
INSERT INTO `top_ups` VALUES (18, 47, 20, 20, 'USR47NOufv3wH1776480520', 'wxpay', 1776480520, 0, 'pending');
INSERT INTO `top_ups` VALUES (19, 53, 100, 100, 'USR53NOtUVHDJ1776582322', 'wxpay', 1776582322, 0, 'success');
INSERT INTO `top_ups` VALUES (20, 55, 500, 500, 'USR55NOYIzQBp1776613897', 'wxpay', 1776613897, 0, 'pending');
INSERT INTO `top_ups` VALUES (21, 69, 20, 20, 'USR69NOx2udv61776759535', 'wxpay', 1776759535, 0, 'pending');
INSERT INTO `top_ups` VALUES (22, 69, 500, 500, 'USR69NOQ3LCIH1776759557', 'wxpay', 1776759557, 0, 'pending');
INSERT INTO `top_ups` VALUES (23, 72, 50, 50, 'USR72NOjsojEj1776784202', 'wxpay', 1776784202, 0, 'pending');

-- ----------------------------
-- Table structure for two_fa_backup_codes
-- ----------------------------
DROP TABLE IF EXISTS `two_fa_backup_codes`;
CREATE TABLE `two_fa_backup_codes`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `code_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_used` tinyint(1) NULL DEFAULT NULL,
  `used_at` datetime(3) NULL DEFAULT NULL,
  `created_at` datetime(3) NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_two_fa_backup_codes_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_two_fa_backup_codes_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of two_fa_backup_codes
-- ----------------------------
INSERT INTO `two_fa_backup_codes` VALUES (1, 62, '$2a$10$zY5./akXX7.WZKzO22lLTuJiaqd0Hu8VnpvwuOZJMLSH8uCpNrNJG', 0, NULL, '2026-04-21 01:52:45.296', NULL);
INSERT INTO `two_fa_backup_codes` VALUES (2, 62, '$2a$10$C0jDmm7.0GWQFkz2J.u0GeCBRcKrj3lFF/mQzZxz0FTF6tsB8PTMe', 0, NULL, '2026-04-21 01:52:45.378', NULL);
INSERT INTO `two_fa_backup_codes` VALUES (3, 62, '$2a$10$lV/6VuA24RoEsC3ptD/OieqUQjKQHKaC11vhzz7MaCGbGF8nmu.MS', 0, NULL, '2026-04-21 01:52:45.458', NULL);
INSERT INTO `two_fa_backup_codes` VALUES (4, 62, '$2a$10$Izx8JNZxmSqTAvuMuJWdyOF82A8.ne7zggur.BIwyAWtz6ZM2oG9W', 0, NULL, '2026-04-21 01:52:45.539', NULL);

-- ----------------------------
-- Table structure for two_fas
-- ----------------------------
DROP TABLE IF EXISTS `two_fas`;
CREATE TABLE `two_fas`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `secret` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_enabled` tinyint(1) NULL DEFAULT NULL,
  `failed_attempts` bigint NULL DEFAULT 0,
  `locked_until` datetime(3) NULL DEFAULT NULL,
  `last_used_at` datetime(3) NULL DEFAULT NULL,
  `created_at` datetime(3) NULL DEFAULT NULL,
  `updated_at` datetime(3) NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_two_fas_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_two_fas_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of two_fas
-- ----------------------------
INSERT INTO `two_fas` VALUES (1, 62, 'Q3PGVXKFKFRU4U53M7T2UROUG22DWTZM', 1, 0, NULL, NULL, '2026-04-21 01:52:45.139', '2026-04-21 01:53:13.944', NULL);

-- ----------------------------
-- Table structure for user_oauth_bindings
-- ----------------------------
DROP TABLE IF EXISTS `user_oauth_bindings`;
CREATE TABLE `user_oauth_bindings`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `provider_id` bigint NOT NULL,
  `provider_user_id` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ux_user_provider`(`user_id` ASC, `provider_id` ASC) USING BTREE,
  UNIQUE INDEX `ux_provider_userid`(`provider_id` ASC, `provider_user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_oauth_bindings
-- ----------------------------

-- ----------------------------
-- Table structure for user_subscriptions
-- ----------------------------
DROP TABLE IF EXISTS `user_subscriptions`;
CREATE TABLE `user_subscriptions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NULL DEFAULT NULL,
  `plan_id` bigint NULL DEFAULT NULL,
  `amount_total` bigint NOT NULL DEFAULT 0,
  `amount_used` bigint NOT NULL DEFAULT 0,
  `start_time` bigint NULL DEFAULT NULL,
  `end_time` bigint NULL DEFAULT NULL,
  `status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `source` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'order',
  `last_reset_time` bigint NULL DEFAULT 0,
  `next_reset_time` bigint NULL DEFAULT 0,
  `upgrade_group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `prev_user_group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `created_at` bigint NULL DEFAULT NULL,
  `updated_at` bigint NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_subscriptions_next_reset_time`(`next_reset_time` ASC) USING BTREE,
  INDEX `idx_user_subscriptions_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_user_sub_active`(`user_id` ASC, `status` ASC, `end_time` ASC) USING BTREE,
  INDEX `idx_user_subscriptions_plan_id`(`plan_id` ASC) USING BTREE,
  INDEX `idx_user_subscriptions_end_time`(`end_time` ASC) USING BTREE,
  INDEX `idx_user_subscriptions_status`(`status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_subscriptions
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `password` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `display_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `role` bigint NULL DEFAULT 1,
  `status` bigint NULL DEFAULT 1,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `github_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `discord_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `oidc_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `wechat_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `telegram_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `access_token` char(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `quota` bigint NULL DEFAULT 0,
  `used_quota` bigint NULL DEFAULT 0,
  `request_count` bigint NULL DEFAULT 0,
  `group` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'default',
  `aff_code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `aff_count` bigint NULL DEFAULT 0,
  `aff_quota` bigint NULL DEFAULT 0,
  `aff_history` bigint NULL DEFAULT 0,
  `inviter_id` bigint NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  `linux_do_id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `setting` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `stripe_customer` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `idx_users_aff_code`(`aff_code` ASC) USING BTREE,
  UNIQUE INDEX `idx_users_access_token`(`access_token` ASC) USING BTREE,
  INDEX `idx_users_stripe_customer`(`stripe_customer` ASC) USING BTREE,
  INDEX `idx_users_username`(`username` ASC) USING BTREE,
  INDEX `idx_users_display_name`(`display_name` ASC) USING BTREE,
  INDEX `idx_users_git_hub_id`(`github_id` ASC) USING BTREE,
  INDEX `idx_users_we_chat_id`(`wechat_id` ASC) USING BTREE,
  INDEX `idx_users_telegram_id`(`telegram_id` ASC) USING BTREE,
  INDEX `idx_users_inviter_id`(`inviter_id` ASC) USING BTREE,
  INDEX `idx_users_deleted_at`(`deleted_at` ASC) USING BTREE,
  INDEX `idx_users_email`(`email` ASC) USING BTREE,
  INDEX `idx_users_discord_id`(`discord_id` ASC) USING BTREE,
  INDEX `idx_users_oidc_id`(`oidc_id` ASC) USING BTREE,
  INDEX `idx_users_linux_do_id`(`linux_do_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 75 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, '532570043', '$2a$10$rg6EXWDXnQJvpMV21soh7.iMx16T/RDQG1jKA40siO9iBlmsELY0y', 'Root User', 100, 1, '', '', '', '', '', '', NULL, 1506411563, 193588437, 4483, 'default', 'hyzK', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"language\":\"zh-CN\"}', '', '');
INSERT INTO `users` VALUES (2, 'yangshuo1281', '$2a$10$BLfSgtKUKCv2hJ6ZC.1.iOUckupspsxFpQZxeqedm1WpSW8dEhPZK', 'yangshuo1281', 1, 1, '', '', '', '', '', '', NULL, 48291834, 9208166, 2553, 'default', 'N6Pd', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (3, 'al90slj23@gmail.com', '$2a$10$6TdjFo.j96FqZV1Y7rABR.u47gIsEqninpc3L58M8rnarxOQ6ZMz.', 'al90slj23@gmail.com', 10, 1, '', '', '', '', '', '', NULL, 48442578, 51557422, 969, 'default', 'hui0', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\",\"language\":\"zh-CN\"}', '', '');
INSERT INTO `users` VALUES (4, 'RaphaelLcs', '$2a$10$5oyo/YMd7YDHpnVW.FhJDOwPNGZSNnqg6jUwa.Bs9DNBX/iSalMJO', 'RaphaelLcs', 10, 1, '', '', '', '', '', '', NULL, 50080637, 49919363, 435, 'default', 'bzs1', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (5, 'fengpengzhengju1', '$2a$10$snNdDP98KXrRqvjPmtwPrOn7it0dOtsTz7CyCGLVIlbrK2GrLUFWy', 'fengpengzhengju1', 1, 1, '', '', '', '', '', '', NULL, 21552473, 128447527, 2484, 'default', 'iwsU', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (6, '1575376866@qq.com', '$2a$10$td6Q9oYh1Cw/1tMQkF6naed9EmX.y6M7CPgvLvArV2d1FmH5D3GZW', '1575376866@qq.com', 1, 1, '', '', '', '', '', '', NULL, 16163719, 128562220, 3306, 'default', '6dzj', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (7, '12345678', '$2a$10$8fuEKHVWsLRCVdPBTvBlF.3VwZSqPz7UWdOH9Rn5aWj7VVm9QlUfi', '12345678', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'qmAg', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (8, '38358366@qq.com', '$2a$10$gsnDwKoWki8HpAY1vrSy9e79NqkfoPTaCT5h9Co2JK6Ou/voUiDJG', '38358366@qq.com', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'vzHI', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (9, 'Ryan', '$2a$10$/hD9fkp4nCMLMb0pUJmR/OQYZIkasaHfiWKUVcFP4l5nXe18qVkCG', 'Ryan', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'ePqh', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (10, 'Recommender', '$2a$10$ZGEyAL1FYNqaJ8EucjAD6u1kR7XVsIPaK.4tfk7hOttNWf2idmL3y', 'Recommender', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'kum2', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (11, '383669141@qq.com', '$2a$10$oeY277/eqKO2jRV2bzuEC.SWOvlSPFJsN5fbsJcnUXbTDMq2DRmU6', '383669141@qq.com', 1, 1, '', '', '', '', '', '', NULL, 12916500, 87197146, 2009, 'default', '6uT9', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (12, 'wukangbin2026', '$2a$10$8EU.WGKtO2D3LJF9sA40S.HTGFDbVIKUIyWfXzh3ERWyLeiUnjwZ6', 'wukangbin2026', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'jKaw', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (13, 'caaaa', '$2a$10$43tHuOkGyAp959fOkgnmvupmzbDk8RpN/8nz8GJf6L/y2JSD3tT72', 'caaaa', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'iRXV', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (14, '1483899622@qq。com', '$2a$10$Ii2CHrm54KR83wQbVEHedu3yN1hDTomvs1iRZ.oZIsZELw8nP6kpC', '1483899622@qq。com', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '7qbE', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (15, '1483899622@qq.com', '$2a$10$WTXexBVLXNLu9wrJhxtez.d4QygrCIto9I9H.CSX5F8FhPW9szFFK', '1483899622@qq.com', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'alFM', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (16, 'luolu1182', '$2a$10$PXz9r.7wSp6vDfBVC2CtY.GIDh0en.PZh0TCGvyxgXmTYLnOSr1UC', 'luolu1182', 1, 1, '', '', '', '', '', '', NULL, 3572485, 1427515, 340, 'default', 'iLIM', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (17, '白羊', '$2a$10$83QSv7SCxFABHT.4H1TKY.7CJPMrDPpX1cNurp71HSQZKdt3b9wLm', '白羊', 1, 1, '', '', '', '', '', '', NULL, 10000000, 0, 0, 'default', 'xd8V', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (18, 'hmzhou', '$2a$10$r5OJapUf9VdT5dMDwqu3B..9Q01SzgUTqagA/jx2d/6onIXUHiMdK', 'hmzhou', 1, 1, '', '', '', '', '', '', NULL, 22028717, 2971283, 664, 'default', 'qqJx', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (19, 'livesflying', '$2a$10$Son4FM..31L./5FWxn9A0OxzX6.rMjBWwi/rcM7BxXnipr0J681fi', 'livesflying', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'zutm', 0, 0, 0, 5, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (20, 'itactor@foxmail.com', '$2a$10$rFWBFRpWGYLJLjFkStSUhOJLJ/wJLOVVjYyBEMOP71HaCpgAX53XS', 'itactor@foxmail.com', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '7X6I', 0, 0, 0, 5, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (21, 'lhao', '$2a$10$vXPCRhnSWVpU41Nsi1Yh/u6KM7QXsn7N2HZsDEdGWBpKydXplO4Wu', 'lhao', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'uEdu', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (22, 'Thomas', '$2a$10$QHMzsKTUkHlZkQlSH4NhG.31/adDSfPRSo9P4APhfbkBrj2NQwGAO', 'Thomas', 1, 1, '', '', '', '', '', '', NULL, 15478, 34984522, 1150, 'default', 'iO08', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (23, 'zhuyalin', '$2a$10$to5gBw75pfeDLMfMcoemIO2gFwVLcVr8ZWXAR8FJOU7i/NEY.OVKe', 'zhuyalin', 1, 1, '', '', '', '', '', '', NULL, 10000000, 0, 0, 'default', 'c38D', 0, 0, 0, 18, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (24, 'kknd', '$2a$10$YB2j7tesRt9xXyET/WJwoOyBoOLq87PQ50IjiADnTl4beOtwJiyxO', 'kknd', 1, 2, '', '', '', '', '', '', NULL, 500000000, 0, 0, 'default', 'kMzX', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', 'cus_test');
INSERT INTO `users` VALUES (25, 'Aa123456SADXA125', '$2a$10$FaPFBD2juydUbfhAsgTSLOoxJLrtKOOvxje3cJX6gCH.RTsvtwDHC', 'Aa123456SADXA125', 1, 2, '', '', '', '', '', '', NULL, 250000000, 0, 0, 'default', 'wlSl', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', 'cus_poc_local');
INSERT INTO `users` VALUES (26, 'Aa223456SADXA125', '$2a$10$iPi9XDOz5wOPzGwJdxus6elp2nZME62Gyf9/WkFCzQ.zrXfpSB1c.', 'Aa223456SADXA125', 1, 2, '', '', '', '', '', '', NULL, 250000000, 0, 0, 'default', '9y2m', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', 'cus_poc_local');
INSERT INTO `users` VALUES (27, 'perez44746', '$2a$10$t88CLJ.ZDFL.rISJ04pcge6z0VSS8IklY4sf7A6rOQ09JTNXa6wSG', 'perez44746', 1, 2, '', '', '', '', '', '', NULL, 203000000, 0, 0, 'default', 'Ofdb', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', 'cus_auto_exploit');
INSERT INTO `users` VALUES (28, 'ars6868@163.com', '$2a$10$3jk1VswwqdBEE6qnh94ise2N917R7ssexnrTuSL8mQJHrawo90qEq', 'ars6868@163.com', 1, 1, '', '', '', '', '', '', NULL, 8546087, 1453913, 2127, 'default', 'sZiO', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (29, 'amelia538', '$2a$10$5.p1u/GazuNVk/bLzIo9XeVbE8PXHUJId4IKWDqnspdkuNEFGA2NK', 'amelia538', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '8CpU', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (30, '8817018@qq.com', '$2a$10$ZJhF.dtdsdXAHwYU39cjvO.NBClHngMYMBXU9YqFd4zxdGsMcv60G', '8817018@qq.com', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '3qan', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (31, 'test', '$2a$10$.RUutOWTEpB0xjKSkdIm8erJaSEP6XdqXSnqoFNaUnDioQ84ELHmy', 'test', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '371v', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (32, 'qiqi114', '$2a$10$zKTAWaU/DQ32ahw9qoUz/.xbyAGbx3mXYUQPJOOPUV4A82JHJAjzq', 'qiqi114', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'FYps', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (33, 'Minesssbig203', '$2a$10$6jiThv00o2GSroJZcM7s9OgvjIz5acbObQbS7uhfLk.F1dYxADtP.', 'Minesssbig203', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'ZiHj', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (34, 'lonesea', '$2a$10$xgP9IqlDa51AMgh5vZVK1uOPv6ArFU2zj3/xVsL7t/rc70zwvGLH.', 'lonesea', 1, 1, '', '', '', '', '', '', NULL, 4165835201, 834164799, 12343, 'default', 'lnLL', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (35, 'pht_szhdh55q', '$2a$10$0TS6pxt/QIlGvkwABQdJXea/cpDuRq7pfBnMb0oQILf.1smrOUM66', 'pht_szhdh55q', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '1Rok', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (36, '1761947175', '$2a$10$B6EBuT7WCGAj4VI19JB4IuoOGp1g5XXdwJTYT2q/qdUMFY7QVdpTy', '1761947175', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'Kj5J', 0, 0, 0, 17, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (37, '1391442780', '$2a$10$RV3OAnTfpfLyKtLJUAf8s.LLG.0UFg77y7iRpoiXE/9Kg0vecY53G', '1391442780', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'YzSQ', 0, 0, 0, 17, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (38, 'xmm000', '$2a$10$HEcBOu2y03C4lqK1OdPL..QPghpQ6GBQ2bip07w2Rbezn0u4vsXz6', 'xmm000', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'qM7N', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (39, 'dai618', '$2a$10$Sp/ASybmRJOw/XNMw8kgsuGEGEk7xyA172QHUEc8w/2Kzd6jSo132', 'dai618', 1, 1, '', '', '', '', '', '', NULL, 5000000, 0, 0, 'default', '3PR0', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (40, 'b021981667cbe9c1', '$2a$10$3YGORonXiUdrTvNpypFeGu9ZA/kno56TOGYzXs.0BoWAB673l/9Ae', 'b021981667cbe9c1', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'vNzc', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (41, 'ben44057', '$2a$10$4Zb3MEvJhImVPTEOd3Z2Due/ldDym3eemf8NSfUSFr6ozM.7m/zi2', 'ben44057', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '0Is4', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (42, 'testuser', '$2a$10$0XxpX86hy/WpzBoFNfXWAOUFdw9R6l/aMgciFuha/cCqlPuikhLci', 'testuser', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'SjSe', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (43, 'uty2eyven40', '$2a$10$ophqBhbaePSjl5h8gLIhxewP32WV2zPUT1ZzIHgtOMDhRt1NlryhK', 'uty2eyven40', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'tWpx', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (44, 'pht_dee8e2x3', '$2a$10$KvaVG0F0EDghOBz3IpNRgeFm5zWhEOcwRNOkm1Si7R1uDFF36JKTi', 'pht_dee8e2x3', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '8GMI', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (45, 'scan_ibkf7neh', '$2a$10$JUL4vSvB5oaarEfTtAxEP.NG8UwnzvRz8t1DpETbjEdR9dOK8IApO', 'scan_ibkf7neh', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '8g1C', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (46, 'unknownco', '$2a$10$cXu.qd9n1GY9B9dNUWBJbecJhDNCApaNERu9SdUCsE7v0GMMMHS8q', 'unknownco', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'VCfk', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (47, 'testusersh99', '$2a$10$iAz0CkIo6s8HjOFCOhSSVe5xnKFhVlH9oaQzFes6tDDY.idzXjaxO', 'testusersh99', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'hNpk', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (48, 'testzozea2', '$2a$10$Q3eExLO1lpN7ZelJpm3AU.9qIs4S9nIysComX1/GRMk6b0GZHW84W', 'testzozea2', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'XqwJ', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (49, 'newnew', '$2a$10$JU7jbFmHbh15CzmyVievjeeLi3eIXNKWOvUQb5MCzzAOeoMQvm7OG', 'newnew', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'AKn3', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (50, 'testtest', '$2a$10$MzIhZAGzUwKpxF41tzf2burFx7btsFIFfAQJmz5TBPKduKUjpdtZK', 'testtest', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'BIg4', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (51, 'dfdg1888', '$2a$10$etDMaNP6iDQUmzo9nch3xuNe9LcEdoihIRuiK3ZQ.A.lji0lU2z9.', 'dfdg1888', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'vnBw', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (52, 'szlp3cj', '$2a$10$BlTnUuDtLe9kb0TtObiwMer1.4L2DUBquIYO1qTiGeiZxdswlXjse', 'szlp3cj', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'R57j', 0, 0, 0, 51, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (53, 'kuangquan', '$2a$10$Es5fbCLksG1gtfLsGLPvOetFQd7P7R30127DXBkrTjZxTIwCC88ci', 'kuangquan', 1, 1, '', '', '', '', '', '', NULL, 92120873, 2379128, 1076, 'default', 's4nC', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (54, 'sc049862', '$2a$10$E8SDDAhX22ukDaoP8j2Ed..P.Z.7OswxLse9SMv8SWP/.dr.iHZIu', 'sc049862', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'z3sW', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (55, 'abc123', '$2a$10$EqOzIWxylDDVgJIkY1xlL.zujnZrQGaJ07E0c4JW7gAGhQd/PrKzu', 'abc123', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '4FAK', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (56, 'p_beqzwh9s', '$2a$10$xtWbnQhm2BhKew.LGh96E.K/GDaBACj3/sLqaWVR2i70qlIDoSzZ2', 'p_beqzwh9s', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'socV', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (57, 'p_npsex251', '$2a$10$clEnatPxnem1NKzP6MINVudY8MlQrd5PIX.Y3b0Pq0s4MbLQCIrOO', 'p_npsex251', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'ppzF', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (58, 'yvX5Ft02', '$2a$10$TMKWVwF9hOjfH448Ba3mf.CYg4vG.Y7X/A/.ZLEgFV8zrrYoZ/uaK', 'yvX5Ft02', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'hopG', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (59, 'nBmHmKquO4', '$2a$10$I9wRlLe5cEgsbQg2eQKT6OP4lgfpQC9hjgi9A9x8j0ntFWh04VP..', 'nBmHmKquO4', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'zBqG', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (60, 'kx6W1Do', '$2a$10$gNo08l/IpWqE.W4ROKBCE.MPTFHzNJy.7iwQyBJPjpY.wzS9CxxvC', 'kx6W1Do', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'xY30', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (61, 'yu624784523', '$2a$10$fZHJpVsOLS14YsCiCC0YyeEIJ7Kg21/JubPiNIEdQs2iCZvngzD/u', 'yu624784523', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'T2kW', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (62, 'david', '$2a$10$6T4dzn/V9HIe68UFSzNtEe0TqDqoKeiLm6hsBB004KLZ7h6C7Avhi', 'david', 1, 1, '', '', '', '', '', '', 'fAlT4zZFludG+roTCNPVKWUQcM48ZiCS', 148990643, 6009357, 613, '渠道用户', 'hLQq', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (63, 'daiwenhan', '$2a$10$If99dHtR/LkxnSPAiwtq3.frIJ7YodEat0s9NtTXBH8fAC0y6zbG.', 'daiwenhan', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'TCEI', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (64, 'fs14374e', '$2a$10$FNYbAl8dpjf2aLCI6uYuEeFmSBQBP1AVuAF0SrfnVFhZLuEp1Wrc.', 'fs14374e', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'QKk7', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (65, 'user751dd900', '$2a$10$6AWKwOIgEgVsZiZCEnhi4.8kasyrb.FiKSYSICGA7TtlMBqgqC0Ci', 'user751dd900', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'XSum', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (66, 'userf4115bf3', '$2a$10$X1rEsv3ywuuJfYXeMpKKhu.XTNXAWlYZggvkcA4.4rQWnGWYw/yzi', 'userf4115bf3', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '8Ldw', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (67, 'sageXnfD', '$2a$10$F5lOI.jxQMy/rVMpXLr3auuPBWBXW5xTaoOG6oB9p4UZelXwvuGw2', 'sageXnfD', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'rNBi', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (68, 'hbpuiddequ', '$2a$10$9Cp6plNy9GSkXfeG3hOlVu2gHeT6qdzJb1L/xwcamSU3CVX1sys96', 'hbpuiddequ', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'nDbU', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (69, 'kira', '$2a$10$89kjZrxXj/URALK2.moATuqxw7/I8Cw9JnEy9qSL2axs0CqXSZkxm', 'kira', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'ifxJ', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (70, 'bamboo', '$2a$10$ScyfOW8zSCG8pJg/XhyucOCC/1bx5GxvBZj0UVZs9x4kNF4UDN22.', 'bamboo', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'UvsD', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (71, 'pcj-600', '$2a$10$XKMiKPCa5YfG154DpaMO/OIU9sdUpKuRSemia15NSdi/WBsvztDja', 'pcj-600', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', '243K', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (72, 'yyzq', '$2a$10$T9/f1.k4pXcLlyUVSjyCMexBAf4ci53MEw6l09jbiZp3LuzgIYUkC', 'yyzq', 1, 1, '', '', '', '', '', '', NULL, 17495912, 12504094, 2267, '渠道用户', 'RlY1', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (73, 'ccadward', '$2a$10$NrsrEnprFfQtJLiQnqoknOwCHwv5W/b6SAIW2pWjyMJMHyoUdzzS2', 'ccadward', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'bv5z', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');
INSERT INTO `users` VALUES (74, 'usera6e474ec', '$2a$10$mKFSvxaWGl0PWYpj5o7HbOQFNnJMRwk.vj7cJV4N9RFb8MRugAXDC', 'usera6e474ec', 1, 1, '', '', '', '', '', '', NULL, 0, 0, 0, 'default', 'PkdT', 0, 0, 0, 0, NULL, '', '{\"gotify_priority\":0,\"sidebar_modules\":\"{\\\"chat\\\":{\\\"chat\\\":true,\\\"enabled\\\":true,\\\"playground\\\":true},\\\"console\\\":{\\\"detail\\\":true,\\\"enabled\\\":true,\\\"log\\\":true,\\\"midjourney\\\":true,\\\"task\\\":true,\\\"token\\\":true},\\\"personal\\\":{\\\"enabled\\\":true,\\\"personal\\\":true,\\\"topup\\\":true}}\"}', '', '');

-- ----------------------------
-- Table structure for vendors
-- ----------------------------
DROP TABLE IF EXISTS `vendors`;
CREATE TABLE `vendors`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `icon` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `status` bigint NULL DEFAULT 1,
  `created_time` bigint NULL DEFAULT NULL,
  `updated_time` bigint NULL DEFAULT NULL,
  `deleted_at` datetime(3) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_vendor_name_delete_at`(`name` ASC, `deleted_at` ASC) USING BTREE,
  INDEX `idx_vendors_deleted_at`(`deleted_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of vendors
-- ----------------------------
INSERT INTO `vendors` VALUES (1, 'Anthropic', '', 'Claude.Color', 1, 1775847847, 1775847847, NULL);
INSERT INTO `vendors` VALUES (2, 'OpenAI', '', 'OpenAI', 1, 1775847847, 1775847847, NULL);
INSERT INTO `vendors` VALUES (3, 'DeepSeek', '', 'DeepSeek.Color', 1, 1775847847, 1775847847, NULL);
INSERT INTO `vendors` VALUES (4, 'xAI', '', 'XAI', 1, 1775847847, 1775847847, NULL);
INSERT INTO `vendors` VALUES (5, 'Moonshot', '', 'Moonshot', 1, 1775847847, 1775847847, NULL);
INSERT INTO `vendors` VALUES (6, '阿里巴巴', '', 'Qwen.Color', 1, 1775847847, 1775847847, NULL);
INSERT INTO `vendors` VALUES (7, '智谱', '', 'Zhipu.Color', 1, 1775847847, 1775847847, NULL);
INSERT INTO `vendors` VALUES (8, '海螺 AI', '', 'Hailuo.Color', 1, 1775876165, 1775876165, NULL);
INSERT INTO `vendors` VALUES (9, 'Google', '', 'Google.Color', 1, 1775922305, 1775922305, NULL);
INSERT INTO `vendors` VALUES (10, '即梦', '', 'Jimeng.Color', 1, 1775922889, 1775922889, NULL);

SET FOREIGN_KEY_CHECKS = 1;
