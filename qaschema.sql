-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'questions'
--
-- ---

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `product_id` INTEGER NOT NULL DEFAULT NULL,
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT 0,
  `body` VARCHAR NOT NULL DEFAULT 'NULL',
  `date` DATETIME NOT NULL DEFAULT 'NULL',
  `name` VARCHAR NOT NULL DEFAULT 'NULL',
  `email` VARCHAR NOT NULL DEFAULT 'NULL',
  `helpfulness` INT NULL DEFAULT 0,
  `reported` CHAR NOT NULL DEFAULT 'false' COMMENT 'should be boolean datatype',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'answers'
--
-- ---

DROP TABLE IF EXISTS `answers`;

CREATE TABLE `answers` (
  `question_id` INTEGER NOT NULL DEFAULT 0,
  `id` INTEGER NOT NULL AUTO_INCREMENT DEFAULT NULL,
  `body` VARCHAR NOT NULL DEFAULT 'NULL',
  `date` DATETIME NOT NULL DEFAULT 'NULL',
  `name` VARCHAR NULL DEFAULT NULL,
  `email` VARCHAR NOT NULL DEFAULT 'NULL',
  `helpfulness` INT NOT NULL DEFAULT 0,
  `reported` CHAR NOT NULL DEFAULT 'false' COMMENT 'should be boolean',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'photos'
--
-- ---

DROP TABLE IF EXISTS `photos`;

CREATE TABLE `photos` (
  `answer_id` INTEGER NOT NULL DEFAULT NULL,
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  `url` VARCHAR NOT NULL DEFAULT 'NULL',
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'product'
--
-- ---

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` INTEGER NULL AUTO_INCREMENT DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys
-- ---

ALTER TABLE `questions` ADD FOREIGN KEY (product_id) REFERENCES `product` (`id`);
ALTER TABLE `answers` ADD FOREIGN KEY (question_id) REFERENCES `questions` (`id`);
ALTER TABLE `photos` ADD FOREIGN KEY (answer_id) REFERENCES `answers` (`id`);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `questions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `answers` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `photos` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `product` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO `questions` (`product_id`,`id`,`body`,`date`,`name`,`email`,`helpfulness`,`reported`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `answers` (`question_id`,`id`,`body`,`date`,`name`,`email`,`helpfulness`,`reported`) VALUES
-- ('','','','','','','','');
-- INSERT INTO `photos` (`answer_id`,`id`,`url`) VALUES
-- ('','','');
-- INSERT INTO `product` (`id`) VALUES
-- ('');