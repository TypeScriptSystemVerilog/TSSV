import pcie_reg_pkg::*;

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

// Commit ID: 4b5fe2f1c2c38996f19271c3c4a85fca8bbc7b61



module pcie_reg
(
input logic  clk,
input logic  rst_b,
input logic [11:0] paddr,
input logic [31:0] pwdata,
output logic [31:0] prdata,
input logic  psel,
input logic  penable,
input logic  pwrite,
output logic  pready,
output reg  pslverr,
output logic [31:0] cfg_pciephy_ctrl_0,
output logic [31:0] cfg_pciephy_ctrl_1,
input logic [31:0] cfg_pciephy_ctrl_2,
output logic [31:0] cfg_pciephy_ctrl_3,
output logic [31:0] cfg_pciephy_ctrl_4,
output logic [31:0] cfg_pciephy_ctrl_5,
output logic [31:0] cfg_pciephy_ctrl_6,
output logic [31:0] cfg_pciephy_ctrl_7,
output logic [31:0] cfg_pciephy_ctrl_8,
output logic [31:0] cfg_pciephy_ctrl_9,
output logic [31:0] cfg_pciephy_ctrl_10,
output logic [31:0] cfg_pciephy_ctrl_11,
output logic [31:0] cfg_pciephy_ctrl_12,
output logic [31:0] cfg_pciephy_ctrl_13,
output logic [31:0] cfg_pciephy_ctrl_14,
output logic [31:0] cfg_pciephy_ctrl_15,
output logic [31:0] cfg_pciephy_ctrl_16,
output logic [31:0] cfg_pciephy_ctrl_17,
output logic [31:0] cfg_pciephy_ctrl_18,
output logic [31:0] cfg_pciephy_ctrl_19,
output logic [31:0] cfg_pciephy_ctrl_20,
output logic [31:0] cfg_pciephy_ctrl_21,
output logic [31:0] cfg_pciephy_ctrl_22,
output logic [31:0] cfg_pciephy_ctrl_23,
output logic [31:0] cfg_pciephy_ctrl_24,
output logic [31:0] cfg_pciephy_ctrl_25,
output logic [31:0] cfg_pciephy_ctrl_26,
output logic [31:0] cfg_pciephy_ctrl_27,
output logic [31:0] cfg_pciephy_ctrl_28,
output logic [31:0] cfg_pciephy_ctrl_29,
output logic [31:0] cfg_pciephy_ctrl_30,
output logic [31:0] cfg_pciephy_ctrl_31,
output logic [31:0] cfg_pciephy_ctrl_32,
output logic [31:0] cfg_pciephy_ctrl_33,
output logic [31:0] cfg_pciephy_ctrl_34,
output logic [31:0] cfg_pciephy_ctrl_35,
output logic [31:0] cfg_pciephy_ctrl_36,
output logic [31:0] cfg_pciephy_ctrl_37,
output logic [31:0] cfg_pciephy_ctrl_38,
output logic [31:0] cfg_pciephy_ctrl_39,
output logic [31:0] cfg_pciephy_ctrl_40,
output logic [31:0] cfg_pciephy_ctrl_41,
output logic [31:0] cfg_pciephy_ctrl_42,
output logic [31:0] cfg_pciephy_ctrl_43,
output logic [31:0] cfg_pciephy_ctrl_44,
output logic [31:0] cfg_pciephy_ctrl_45,
output logic [31:0] cfg_pciephy_ctrl_46,
output logic [31:0] cfg_pciephy_ctrl_47,
output logic [31:0] cfg_pciephy_ctrl_48,
output logic [31:0] cfg_pciephy_ctrl_49,
output logic [31:0] cfg_pciephy_ctrl_50,
output logic [31:0] cfg_pciephy_ctrl_51,
output logic [31:0] cfg_pciephy_ctrl_52,
output logic [31:0] cfg_pciephy_ctrl_53,
output logic [31:0] cfg_pciephy_ctrl_54,
output logic [31:0] cfg_pciephy_ctrl_55,
output logic [31:0] cfg_pciephy_ctrl_56,
output logic [31:0] cfg_pciephy_ctrl_57,
output logic [31:0] cfg_pciephy_ctrl_58,
output logic [31:0] cfg_pciephy_ctrl_59,
output logic [31:0] cfg_pciephy_ctrl_60,
output logic [31:0] cfg_pciephy_ctrl_61,
output logic [31:0] cfg_pciephy_ctrl_62,
output logic [31:0] cfg_pciephy_ctrl_63,
output logic [31:0] cfg_pciephy_ctrl_64,
output logic [31:0] cfg_pciephy_ctrl_65,
output logic [31:0] cfg_pciephy_ctrl_66,
output logic [31:0] cfg_pciephy_ctrl_67,
output logic [31:0] cfg_pciephy_ctrl_68,
output logic [31:0] cfg_pciephy_ctrl_69,
output logic [31:0] cfg_pciephy_ctrl_70,
output logic [31:0] cfg_pciephy_ctrl_71,
output logic [31:0] cfg_pciephy_ctrl_72,
output logic [31:0] cfg_pciephy_ctrl_73,
output logic [31:0] cfg_pciephy_ctrl_74,
output logic [31:0] cfg_pciephy_ctrl_75,
output logic [31:0] cfg_pciephy_ctrl_76,
output logic [31:0] cfg_pciephy_ctrl_77,
output logic [31:0] cfg_pciephy_ctrl_78,
output logic [31:0] cfg_pciephy_ctrl_79,
output logic [31:0] cfg_pciephy_ctrl_80,
output logic [31:0] cfg_pciephy_ctrl_81,
output logic [31:0] cfg_pciephy_ctrl_82,
output logic [31:0] cfg_pciephy_ctrl_83,
output logic [31:0] cfg_pciephy_ctrl_84,
output logic [31:0] cfg_pciephy_ctrl_85,
output logic [31:0] cfg_pciephy_ctrl_86,
output logic [31:0] cfg_pciephy_ctrl_87,
output logic [31:0] cfg_pciephy_ctrl_88,
output logic [31:0] cfg_pciephy_ctrl_89,
output logic [31:0] cfg_pciephy_ctrl_90,
output logic [31:0] cfg_pciephy_ctrl_91,
output logic [31:0] cfg_pciephy_ctrl_92,
output logic [31:0] cfg_pciephy_ctrl_93,
output logic [31:0] cfg_pciephy_ctrl_94,
output logic [31:0] cfg_pciephy_ctrl_95,
output logic [31:0] cfg_pciephy_ctrl_96,
output logic [31:0] cfg_pciephy_ctrl_97,
output logic [31:0] cfg_pciephy_ctrl_98,
output logic [31:0] cfg_pciephy_ctrl_99,
output logic [31:0] cfg_pciephy_ctrl_100,
output logic [31:0] cfg_pciephy_ctrl_101,
output logic [31:0] cfg_pciephy_ctrl_102,
output logic [31:0] cfg_pciephy_ctrl_103,
output logic [31:0] cfg_pciephy_ctrl_104,
output logic [31:0] cfg_pciephy_ctrl_105,
output logic [31:0] cfg_pciephy_ctrl_106,
output logic [31:0] cfg_pciephy_ctrl_107,
output logic [31:0] cfg_pciephy_ctrl_108,
output logic [31:0] cfg_pciephy_ctrl_109,
output logic [31:0] cfg_pciephy_ctrl_110,
output logic [31:0] cfg_pciephy_ctrl_111,
output logic [31:0] cfg_pciephy_ctrl_112,
output logic [31:0] cfg_pciephy_ctrl_113,
output logic [31:0] cfg_pciephy_ctrl_114,
output logic [31:0] cfg_pciephy_ctrl_115,
output logic [31:0] cfg_pciephy_ctrl_116,
output logic [31:0] cfg_pciephy_ctrl_117,
output logic [31:0] cfg_pciephy_ctrl_118,
output logic [31:0] cfg_pciephy_ctrl_119,
output logic [31:0] cfg_pciephy_ctrl_120,
output logic [31:0] cfg_pciephy_ctrl_121,
output logic [31:0] cfg_pciephy_ctrl_122,
output logic [31:0] cfg_pciephy_ctrl_123,
output logic [31:0] cfg_pciephy_ctrl_124,
output logic [31:0] cfg_pciephy_ctrl_125,
output logic [31:0] cfg_pciephy_ctrl_126,
output logic [31:0] cfg_pciephy_ctrl_127,
output logic [31:0] cfg_pciephy_ctrl_128,
output logic [31:0] cfg_pciephy_ctrl_129,
output logic [31:0] cfg_pciephy_ctrl_130,
output logic [31:0] cfg_pciephy_ctrl_131,
output logic [31:0] cfg_pciephy_ctrl_132,
output logic [31:0] cfg_pciephy_ctrl_133,
output logic [31:0] cfg_pciephy_ctrl_134,
output logic [31:0] cfg_pciephy_ctrl_135,
output logic [31:0] cfg_pciephy_ctrl_136,
output logic [31:0] cfg_pciephy_ctrl_137,
output logic [31:0] cfg_pciephy_ctrl_138,
output logic [31:0] cfg_pciephy_ctrl_139,
output logic [31:0] cfg_pciephy_ctrl_140,
output logic [31:0] cfg_pciephy_ctrl_141,
output logic [31:0] cfg_pciephy_ctrl_142,
output logic [31:0] cfg_pciephy_ctrl_143,
output logic [31:0] cfg_pciephy_ctrl_144,
output logic [31:0] cfg_pciephy_ctrl_145,
output logic [31:0] cfg_pciephy_ctrl_146,
output logic [31:0] cfg_pciephy_ctrl_147,
output logic [31:0] cfg_pciephy_ctrl_148,
output logic [31:0] cfg_pciephy_ctrl_149,
output logic [31:0] cfg_pciephy_ctrl_150,
output logic [31:0] cfg_pciephy_ctrl_151,
output logic [31:0] cfg_pciephy_ctrl_152,
output logic [31:0] cfg_pciephy_ctrl_153,
output logic [31:0] cfg_pciephy_ctrl_154,
output logic [31:0] cfg_pciephy_ctrl_155,
output logic [31:0] cfg_pciephy_ctrl_156,
output logic [31:0] cfg_pciephy_ctrl_157,
output logic [31:0] cfg_pciephy_ctrl_158,
output logic [31:0] cfg_pciephy_ctrl_159,
output logic [31:0] cfg_pciephy_ctrl_160,
output logic [31:0] cfg_pciephy_ctrl_161,
output logic [31:0] cfg_pciephy_ctrl_162,
output logic [31:0] cfg_pciephy_ctrl_163,
output logic [31:0] cfg_pciephy_ctrl_164,
output logic [31:0] cfg_pciephy_ctrl_165,
output logic [31:0] cfg_pciephy_ctrl_166,
output logic [31:0] cfg_pciephy_ctrl_167,
output logic [31:0] cfg_pciephy_ctrl_168,
output logic [31:0] cfg_pciephy_ctrl_169,
output logic [31:0] cfg_pciephy_ctrl_170,
output logic [31:0] cfg_pciephy_ctrl_171,
output logic [31:0] cfg_pciephy_ctrl_172,
output logic [31:0] cfg_pciephy_ctrl_173,
output logic [31:0] cfg_pciephy_ctrl_174,
output logic [31:0] cfg_pciephy_ctrl_175,
output logic [31:0] cfg_pciephy_ctrl_176,
output logic [31:0] cfg_pciephy_ctrl_177,
output logic [31:0] cfg_pciephy_ctrl_178,
output logic [31:0] cfg_pciephy_ctrl_179,
output logic [31:0] cfg_pciephy_ctrl_180,
output logic [31:0] cfg_pciephy_ctrl_181,
output logic [31:0] cfg_pciephy_ctrl_182,
output logic [31:0] cfg_pciephy_ctrl_183,
output logic [31:0] cfg_pciephy_ctrl_184,
output logic [31:0] cfg_pciephy_ctrl_185,
output logic [31:0] cfg_pciephy_ctrl_186,
output logic [31:0] cfg_pciephy_ctrl_187,
output logic [31:0] cfg_pciephy_ctrl_188,
output logic [31:0] cfg_pciephy_ctrl_189,
output logic [31:0] cfg_pciephy_ctrl_190,
output logic [31:0] cfg_pciephy_ctrl_191,
output logic [31:0] cfg_pciephy_ctrl_192,
output logic [31:0] cfg_pciephy_ctrl_193,
output logic [31:0] cfg_pciephy_ctrl_194,
output logic [31:0] cfg_pciephy_ctrl_195,
output logic [31:0] cfg_pciephy_ctrl_196,
output logic [31:0] cfg_pciephy_ctrl_197,
output logic [31:0] cfg_pciephy_ctrl_198,
output logic [31:0] cfg_pciephy_ctrl_199,
output logic [31:0] cfg_pciephy_ctrl_200,
output logic [31:0] cfg_pciephy_ctrl_201,
output logic [31:0] cfg_pciephy_ctrl_202,
output logic [31:0] cfg_pciephy_ctrl_203,
output logic [31:0] cfg_pciephy_ctrl_204,
output logic [31:0] cfg_pciephy_ctrl_205,
output logic [31:0] cfg_pciephy_ctrl_206,
output logic [31:0] cfg_pciephy_ctrl_207,
output logic [31:0] cfg_pciephy_ctrl_208,
output logic [31:0] cfg_pciephy_ctrl_209,
output logic [31:0] cfg_pciephy_ctrl_210,
output logic [31:0] cfg_pciephy_ctrl_211,
output logic [31:0] cfg_pciephy_ctrl_212,
output logic [31:0] cfg_pciephy_ctrl_213,
output logic [31:0] cfg_pciephy_ctrl_214,
output logic [31:0] cfg_pciephy_ctrl_215,
output logic [31:0] cfg_pciephy_ctrl_216,
output logic [31:0] cfg_pciephy_ctrl_217,
output logic [31:0] cfg_pciephy_ctrl_218,
output logic [31:0] cfg_pciephy_ctrl_219,
output logic [31:0] cfg_pciephy_ctrl_220,
output logic [31:0] cfg_pciephy_ctrl_221,
output logic [31:0] cfg_pciephy_ctrl_222,
output logic [31:0] cfg_pciephy_ctrl_223,
output logic [31:0] cfg_pciephy_ctrl_224,
output logic [31:0] cfg_pciephy_ctrl_225,
output logic [31:0] cfg_pciephy_ctrl_226,
output logic [31:0] cfg_pciephy_ctrl_227,
output logic [31:0] cfg_pciephy_ctrl_228,
output logic [31:0] cfg_pciephy_ctrl_229,
output logic [31:0] cfg_pciephy_ctrl_230,
output logic [31:0] cfg_pciephy_ctrl_231,
output logic [31:0] cfg_pciephy_ctrl_232,
output logic [31:0] cfg_pciephy_ctrl_233,
output logic [31:0] cfg_pciephy_ctrl_234,
output logic [31:0] cfg_pciephy_ctrl_235,
output logic [31:0] cfg_pciephy_ctrl_236,
output logic [31:0] cfg_pciephy_ctrl_237,
output logic [31:0] cfg_pciephy_ctrl_238,
output logic [31:0] cfg_pciephy_ctrl_239,
output logic [31:0] cfg_pciephy_ctrl_240,
output logic [31:0] cfg_pciephy_ctrl_241,
output logic [31:0] cfg_pciephy_ctrl_242,
output logic [31:0] cfg_pciephy_ctrl_243,
output logic [31:0] cfg_pciephy_ctrl_244,
output logic [31:0] cfg_pciephy_ctrl_245,
output logic [31:0] cfg_pciephy_ctrl_246,
output logic [31:0] cfg_pciephy_ctrl_247,
output logic [31:0] cfg_pciephy_ctrl_248,
output logic [31:0] cfg_pciephy_ctrl_249,
output logic [31:0] cfg_pciephy_ctrl_250,
output logic [31:0] cfg_pciephy_ctrl_251,
output logic [31:0] cfg_pciephy_ctrl_252,
output logic [31:0] cfg_pciephy_ctrl_253,
output logic [31:0] cfg_pciephy_ctrl_254,
output logic [31:0] cfg_pciephy_ctrl_255,
output logic [31:0] cfg_pciephy_ctrl_256,
output logic [31:0] cfg_pciephy_ctrl_257,
output logic [31:0] cfg_pciephy_ctrl_258,
output logic [31:0] cfg_pciephy_ctrl_259,
output logic [31:0] cfg_pciephy_ctrl_260,
output logic [31:0] cfg_pciephy_ctrl_261,
output logic [31:0] cfg_pciephy_ctrl_262,
output logic [31:0] cfg_pciephy_ctrl_263,
output logic [31:0] cfg_pciephy_ctrl_264,
output logic [31:0] cfg_pciephy_ctrl_265,
output logic [31:0] cfg_pciephy_ctrl_266,
output logic [31:0] cfg_pciephy_ctrl_267,
output logic [31:0] cfg_pciephy_ctrl_268,
output logic [31:0] cfg_pciephy_ctrl_269,
output logic [31:0] cfg_pciephy_ctrl_270,
output logic [31:0] cfg_pciephy_ctrl_271,
output logic [31:0] cfg_pciephy_ctrl_272,
output logic [31:0] cfg_pciephy_ctrl_273,
output logic [31:0] cfg_pciephy_ctrl_274,
output logic [31:0] cfg_pciephy_ctrl_275,
output logic [31:0] cfg_pciephy_ctrl_276,
output logic [31:0] cfg_pciephy_ctrl_277,
output logic [31:0] cfg_pciephy_ctrl_278,
output logic [31:0] cfg_pciephy_ctrl_279,
output logic [31:0] cfg_pciephy_ctrl_280,
output logic [31:0] cfg_pciephy_ctrl_281,
output logic [31:0] cfg_pciephy_ctrl_282,
output logic [31:0] cfg_pciephy_ctrl_283,
output logic [31:0] cfg_pciephy_ctrl_284,
output logic [31:0] cfg_pciephy_ctrl_285,
output logic [31:0] cfg_pciephy_ctrl_286,
output logic [31:0] cfg_pciephy_ctrl_287,
output logic [31:0] cfg_pciephy_ctrl_288,
output logic [31:0] cfg_pciephy_ctrl_289,
output logic [31:0] cfg_pciephy_ctrl_290,
output logic [31:0] cfg_pciephy_ctrl_291,
output logic [31:0] cfg_pciephy_ctrl_292,
output logic [31:0] cfg_pciephy_ctrl_293,
output logic [31:0] cfg_pciephy_ctrl_294,
output logic [31:0] cfg_pciephy_ctrl_295,
output logic [31:0] cfg_pciephy_ctrl_296,
output logic [31:0] cfg_pciephy_ctrl_297,
output logic [31:0] cfg_pciephy_ctrl_298,
output logic [31:0] cfg_pciephy_ctrl_299,
output logic [31:0] cfg_pciephy_ctrl_300,
output logic [31:0] cfg_pciephy_ctrl_301,
output logic [31:0] cfg_pciephy_ctrl_302,
output logic [31:0] cfg_pciephy_ctrl_303,
output logic [31:0] cfg_pciephy_ctrl_304,
output logic [31:0] cfg_pciephy_ctrl_305,
output logic [31:0] cfg_pciephy_ctrl_306,
output logic [31:0] cfg_pciephy_ctrl_307,
output logic [31:0] cfg_pciephy_ctrl_308,
output logic [31:0] cfg_pciephy_ctrl_309,
output logic [31:0] cfg_pciephy_ctrl_310,
output logic [31:0] cfg_pciephy_ctrl_311,
output logic [31:0] cfg_pciephy_ctrl_312,
output logic [31:0] cfg_pciephy_ctrl_313,
output logic [31:0] cfg_pciephy_ctrl_314,
output logic [31:0] cfg_pciephy_ctrl_315,
output logic [31:0] cfg_pciephy_ctrl_316,
output logic [31:0] cfg_pciephy_ctrl_317,
output logic [31:0] cfg_pciephy_ctrl_318,
output logic [31:0] cfg_pciephy_ctrl_319,
output logic [31:0] cfg_pciephy_ctrl_320,
output logic [31:0] cfg_pciephy_ctrl_321,
output logic [31:0] cfg_pciephy_ctrl_322,
output logic [31:0] cfg_pciephy_ctrl_323,
output logic [31:0] cfg_pciephy_ctrl_324,
output logic [31:0] cfg_pciephy_ctrl_325,
output logic [31:0] cfg_pciephy_ctrl_326,
output logic [31:0] cfg_pciephy_ctrl_327,
output logic [31:0] cfg_pciephy_ctrl_328,
output logic [31:0] cfg_pciephy_ctrl_329,
output logic [31:0] cfg_pciephy_ctrl_330,
output logic [31:0] cfg_pciephy_ctrl_331,
output logic [31:0] cfg_pciephy_ctrl_332,
output logic [31:0] cfg_pciephy_ctrl_333,
output logic [31:0] cfg_pciephy_ctrl_334,
output logic [31:0] cfg_pciephy_ctrl_335,
output logic [31:0] cfg_pciephy_ctrl_336,
output logic [31:0] cfg_pciephy_ctrl_337,
output logic [31:0] cfg_pciephy_ctrl_338,
output logic [31:0] cfg_pciephy_ctrl_339,
output logic [31:0] cfg_pciephy_ctrl_340,
output logic [31:0] cfg_pciephy_ctrl_341,
output logic [31:0] cfg_pciephy_ctrl_342,
output logic [31:0] cfg_pciephy_ctrl_343,
output logic [31:0] cfg_pciephy_ctrl_344,
output logic [31:0] cfg_pciephy_ctrl_345,
output logic [31:0] cfg_pciephy_ctrl_346,
output logic [31:0] cfg_pciephy_ctrl_347,
output logic [31:0] cfg_pciephy_ctrl_348,
output logic [31:0] cfg_pciephy_ctrl_349,
output logic [31:0] cfg_pciephy_ctrl_350,
output logic [31:0] cfg_pciephy_ctrl_351,
output logic [31:0] cfg_pciephy_ctrl_352,
output logic [31:0] cfg_pciephy_ctrl_353,
output logic [31:0] cfg_pciephy_ctrl_354,
output logic [31:0] cfg_pciephy_ctrl_355,
output logic [31:0] cfg_pciephy_ctrl_356,
output logic [31:0] cfg_pciephy_ctrl_357,
output logic [31:0] cfg_pciephy_ctrl_358,
output logic [31:0] cfg_pciephy_ctrl_359,
output logic [31:0] cfg_pciephy_ctrl_360,
output logic [31:0] cfg_pciephy_ctrl_361,
output logic [31:0] cfg_pciephy_ctrl_362,
output logic [31:0] cfg_pciephy_ctrl_363,
output logic [31:0] cfg_pciephy_ctrl_364,
output logic [31:0] cfg_pciephy_ctrl_365,
output logic [31:0] cfg_pciephy_ctrl_366,
output logic [31:0] cfg_pciephy_ctrl_367,
output logic [31:0] cfg_pciephy_ctrl_368,
output logic [31:0] cfg_pciephy_ctrl_369,
output logic [31:0] cfg_pciephy_ctrl_370,
output logic [31:0] cfg_pciephy_ctrl_371,
output logic [31:0] cfg_pciephy_ctrl_372,
output logic [31:0] cfg_pciephy_ctrl_373,
output logic [31:0] cfg_pciephy_ctrl_374,
output logic [31:0] cfg_pciephy_ctrl_375,
output logic [31:0] cfg_pciephy_ctrl_376,
output logic [31:0] cfg_pciephy_ctrl_377,
output logic [31:0] cfg_pciephy_ctrl_378,
output logic [31:0] cfg_pciephy_ctrl_379,
output logic [31:0] cfg_pciephy_ctrl_380,
output logic [31:0] cfg_pciephy_ctrl_381,
output logic [31:0] cfg_pciephy_ctrl_382,
output logic [31:0] cfg_pciephy_ctrl_383,
output logic [31:0] cfg_pciephy_ctrl_384,
output logic [31:0] cfg_pciephy_ctrl_385,
output logic [31:0] cfg_pciephy_ctrl_386,
output logic [31:0] cfg_pciephy_ctrl_387,
output logic [31:0] cfg_pciephy_ctrl_388,
output logic [31:0] cfg_pciephy_ctrl_389,
output logic [31:0] cfg_pciephy_ctrl_390,
output logic [31:0] cfg_pciephy_ctrl_391,
output logic [31:0] cfg_pciephy_ctrl_392,
output logic [31:0] cfg_pciephy_ctrl_393,
output logic [31:0] cfg_pciephy_ctrl_394,
output logic [31:0] cfg_pciephy_ctrl_395,
output logic [31:0] cfg_pciephy_ctrl_396,
output logic [31:0] cfg_pciephy_ctrl_397,
output logic [31:0] cfg_pciephy_ctrl_398,
output logic [31:0] cfg_pciephy_ctrl_399,
output logic [31:0] cfg_pciephy_ctrl_400,
output logic [31:0] cfg_pciephy_ctrl_401,
output logic [31:0] cfg_pciephy_ctrl_402,
output logic [31:0] cfg_pciephy_ctrl_403,
output logic [31:0] cfg_pciephy_ctrl_404,
output logic [31:0] cfg_pciephy_ctrl_405,
output logic [31:0] cfg_pciephy_ctrl_406,
output logic [31:0] cfg_pciephy_ctrl_407,
output logic [31:0] cfg_pciephy_ctrl_408,
output logic [31:0] cfg_pciephy_ctrl_409,
output logic [31:0] cfg_pciephy_ctrl_410,
output logic [31:0] cfg_pciephy_ctrl_411,
output logic [31:0] cfg_pciephy_ctrl_412,
output logic [31:0] cfg_pciephy_ctrl_413,
output logic [31:0] cfg_pciephy_ctrl_414,
output logic [31:0] cfg_pciephy_ctrl_415,
output logic [31:0] cfg_pciephy_ctrl_416,
output logic [31:0] cfg_pciephy_ctrl_417,
output logic [31:0] cfg_pciephy_ctrl_418,
output logic [31:0] cfg_pciephy_ctrl_419,
output logic [31:0] cfg_pciephy_ctrl_420,
output logic [31:0] cfg_pciephy_ctrl_421,
output logic [31:0] cfg_pciephy_ctrl_422,
output logic [31:0] cfg_pciephy_ctrl_423,
output logic [31:0] cfg_pciephy_ctrl_424,
output logic [31:0] cfg_pciephy_ctrl_425,
output logic [31:0] cfg_pciephy_ctrl_426,
output logic [31:0] cfg_pciephy_ctrl_427,
output logic [31:0] cfg_pciephy_ctrl_428,
output logic [31:0] cfg_pciephy_ctrl_429,
output logic [31:0] cfg_pciephy_ctrl_430,
output logic [31:0] cfg_pciephy_ctrl_431,
output logic [31:0] cfg_pciephy_ctrl_432,
output logic [31:0] cfg_pciephy_ctrl_433,
output logic [31:0] cfg_pciephy_ctrl_434,
output logic [31:0] cfg_pciephy_ctrl_435,
output logic [31:0] cfg_pciephy_ctrl_436,
output logic [31:0] cfg_pciephy_ctrl_437,
output logic [31:0] cfg_pciephy_ctrl_438,
output logic [31:0] cfg_pciephy_ctrl_439,
output logic [31:0] cfg_pciephy_ctrl_440,
output logic [31:0] cfg_pciephy_ctrl_441,
output logic [31:0] cfg_pciephy_ctrl_442,
output logic [31:0] cfg_pciephy_ctrl_443,
output logic [31:0] cfg_pciephy_ctrl_444,
output logic [31:0] cfg_pciephy_ctrl_445,
output logic [31:0] cfg_pciephy_ctrl_446,
output logic [31:0] cfg_pciephy_ctrl_447,
output logic [31:0] cfg_pciephy_ctrl_448,
output logic [31:0] cfg_pciephy_ctrl_449,
output logic [31:0] cfg_pciephy_ctrl_450,
output logic [31:0] cfg_pciephy_ctrl_451,
output logic [31:0] cfg_pciephy_ctrl_452,
output logic [31:0] cfg_pciephy_ctrl_453,
output logic [31:0] cfg_pciephy_ctrl_454,
output logic [31:0] cfg_pciephy_ctrl_455,
output logic [31:0] cfg_pciephy_ctrl_456,
output logic [31:0] cfg_pciephy_ctrl_457,
output logic [31:0] cfg_pciephy_ctrl_458,
output logic [31:0] cfg_pciephy_ctrl_459,
output logic [31:0] cfg_pciephy_ctrl_460,
output logic [31:0] cfg_pciephy_ctrl_461,
output logic [31:0] cfg_pciephy_ctrl_462,
output logic [31:0] cfg_pciephy_ctrl_463,
output logic [31:0] cfg_pciephy_ctrl_464,
output logic [31:0] cfg_pciephy_ctrl_465,
output logic [31:0] cfg_pciephy_ctrl_466,
output logic [31:0] cfg_pciephy_ctrl_467,
output logic [31:0] cfg_pciephy_ctrl_468,
output logic [31:0] cfg_pciephy_ctrl_469,
output logic [31:0] cfg_pciephy_ctrl_470,
output logic [31:0] cfg_pciephy_ctrl_471,
output logic [31:0] cfg_pciephy_ctrl_472,
output logic [31:0] cfg_pciephy_ctrl_473,
output logic [31:0] cfg_pciephy_ctrl_474,
output logic [31:0] cfg_pciephy_ctrl_475,
output logic [31:0] cfg_pciephy_ctrl_476,
output logic [31:0] cfg_pciephy_ctrl_477,
output logic [31:0] cfg_pciephy_ctrl_478,
output logic [31:0] cfg_pciephy_ctrl_479,
output logic [31:0] cfg_pciephy_ctrl_480,
output logic [31:0] cfg_pciephy_ctrl_481,
output logic [31:0] cfg_pciephy_ctrl_482,
output logic [31:0] cfg_pciephy_ctrl_483,
output logic [31:0] cfg_pciephy_ctrl_484,
output logic [31:0] cfg_pciephy_ctrl_485,
output logic [31:0] cfg_pciephy_ctrl_486,
output logic [31:0] cfg_pciephy_ctrl_487,
output logic [31:0] cfg_pciephy_ctrl_488,
output logic [31:0] cfg_pciephy_ctrl_489,
output logic [31:0] cfg_pciephy_ctrl_490,
output logic [31:0] cfg_pciephy_ctrl_491,
output logic [31:0] cfg_pciephy_ctrl_492,
output logic [31:0] cfg_pciephy_ctrl_493,
output logic [31:0] cfg_pciephy_ctrl_494,
output logic [31:0] cfg_pciephy_ctrl_495,
output logic [31:0] cfg_pciephy_ctrl_496,
output logic [31:0] cfg_pciephy_ctrl_497,
output logic [31:0] cfg_pciephy_ctrl_498,
output logic [31:0] cfg_pciephy_ctrl_499,
output logic [31:0] cfg_pciephy_ctrl_500,
output logic [31:0] cfg_pciephy_ctrl_501,
output logic [31:0] cfg_pciephy_ctrl_502,
output logic [31:0] cfg_pciephy_ctrl_503,
output logic [31:0] cfg_pciephy_ctrl_504,
output logic [31:0] cfg_pciephy_ctrl_505,
output logic [31:0] cfg_pciephy_ctrl_506,
output logic [31:0] cfg_pciephy_ctrl_507,
output logic [31:0] cfg_pciephy_ctrl_508,
output logic [31:0] cfg_pciephy_ctrl_509,
output logic [31:0] cfg_pciephy_ctrl_510,
output logic [31:0] cfg_pciephy_ctrl_511,
output logic [31:0] cfg_pciephy_ctrl_512,
output logic [31:0] cfg_pciephy_ctrl_513,
output logic [31:0] cfg_pciephy_ctrl_514,
output logic [31:0] cfg_pciephy_ctrl_515,
output logic [31:0] cfg_pciephy_ctrl_516,
output logic [31:0] cfg_pciephy_ctrl_517,
output logic [31:0] cfg_pciephy_ctrl_518,
output logic [31:0] cfg_pciephy_ctrl_519,
output logic [31:0] cfg_pciephy_ctrl_520,
output logic [31:0] cfg_pciephy_ctrl_521,
output logic [31:0] cfg_pciephy_ctrl_522,
output logic [31:0] cfg_pciephy_ctrl_523,
output logic [31:0] cfg_pciephy_ctrl_524,
output logic [31:0] cfg_pciephy_ctrl_525,
output logic [31:0] cfg_pciephy_ctrl_526,
output logic [31:0] cfg_pciephy_ctrl_527,
output logic [31:0] cfg_pciephy_ctrl_528,
output logic [31:0] cfg_pciephy_ctrl_529,
output logic [31:0] cfg_pciephy_ctrl_530,
output logic [31:0] cfg_pciephy_ctrl_531,
output logic [31:0] cfg_pciephy_ctrl_532,
output logic [31:0] cfg_pciephy_ctrl_533,
output logic [31:0] cfg_pciephy_ctrl_534,
output logic [31:0] cfg_pciephy_ctrl_535,
output logic [31:0] cfg_pciephy_ctrl_536,
output logic [31:0] cfg_pciephy_ctrl_537,
output logic [31:0] cfg_pciephy_ctrl_538,
output logic [31:0] cfg_pciephy_ctrl_539,
output logic [31:0] cfg_pciephy_ctrl_540,
output logic [31:0] cfg_pciephy_ctrl_541,
output logic [31:0] cfg_pciephy_ctrl_542,
output logic [31:0] cfg_pciephy_ctrl_543,
output logic [31:0] cfg_pciephy_ctrl_544,
output logic [31:0] cfg_pciephy_ctrl_545,
output logic [31:0] cfg_pciephy_ctrl_546,
output logic [31:0] cfg_pciephy_ctrl_547,
output logic [31:0] cfg_pciephy_ctrl_548,
output logic [31:0] cfg_pciephy_ctrl_549,
output logic [31:0] cfg_pciephy_ctrl_550,
output logic [31:0] cfg_pciephy_ctrl_551,
output logic [31:0] cfg_pciephy_ctrl_552,
output logic [31:0] cfg_pciephy_ctrl_553,
output logic [31:0] cfg_pciephy_ctrl_554,
output logic [31:0] cfg_pciephy_ctrl_555,
output logic [31:0] cfg_pciephy_ctrl_556,
output logic [31:0] cfg_pciephy_ctrl_557,
output logic [31:0] cfg_pciephy_ctrl_558,
output logic [31:0] cfg_pciephy_ctrl_559,
output logic [31:0] cfg_pciephy_ctrl_560,
output logic [31:0] cfg_pciephy_ctrl_561,
output logic [31:0] cfg_pciephy_ctrl_562,
output logic [31:0] cfg_pciephy_ctrl_563,
output logic [31:0] cfg_pciephy_ctrl_564,
input logic [31:0] cfg_pciephy_ctrl_565,
input logic [31:0] cfg_pciephy_ctrl_566,
input logic [31:0] cfg_pciephy_ctrl_567,
input logic [31:0] cfg_pciephy_ctrl_568,
input logic [31:0] cfg_pciephy_ctrl_569,
input logic [31:0] cfg_pciephy_ctrl_570,
input logic [31:0] cfg_pciephy_ctrl_571,
input logic [31:0] cfg_pciephy_ctrl_572,
input logic [31:0] cfg_pciephy_ctrl_573,
input logic [31:0] cfg_pciephy_ctrl_574,
input logic [31:0] cfg_pciephy_ctrl_575,
input logic [31:0] cfg_pciephy_ctrl_576,
input logic [31:0] cfg_pciephy_ctrl_577,
input logic [31:0] cfg_pciephy_ctrl_578,
input logic [31:0] cfg_pciephy_ctrl_579,
input logic [31:0] cfg_pciephy_ctrl_580,
input logic [31:0] cfg_pciephy_ctrl_581,
input logic [31:0] cfg_pciephy_ctrl_582,
input logic [31:0] cfg_pciephy_ctrl_583,
input logic [31:0] cfg_pciephy_ctrl_584,
input logic [31:0] cfg_pciephy_ctrl_585,
input logic [31:0] cfg_pciephy_ctrl_586,
input logic [31:0] cfg_pciephy_ctrl_587,
input logic [31:0] cfg_pciephy_ctrl_588,
input logic [31:0] cfg_pciephy_ctrl_589
);

logic  reg_rd;
logic  reg_wr;
logic [11:0] reg_addr;
logic [31:0] reg_rdata;
logic [31:0] reg_wdata;
logic [31:0] next_rdata;
logic  in_range;
logic  slverr;
logic  dec_pciephy_ctrl_0;
PCIEPHY_CTRL_0_t reg_pciephy_ctrl_0;
logic  pciephy_ctrl_0_we;
logic  dec_pciephy_ctrl_1;
PCIEPHY_CTRL_1_t reg_pciephy_ctrl_1;
logic  pciephy_ctrl_1_we;
logic  dec_pciephy_ctrl_2;
PCIEPHY_CTRL_2_t reg_pciephy_ctrl_2;
logic  dec_pciephy_ctrl_3;
PCIEPHY_CTRL_3_t reg_pciephy_ctrl_3;
logic  pciephy_ctrl_3_we;
logic  dec_pciephy_ctrl_4;
PCIEPHY_CTRL_4_t reg_pciephy_ctrl_4;
logic  pciephy_ctrl_4_we;
logic  dec_pciephy_ctrl_5;
PCIEPHY_CTRL_5_t reg_pciephy_ctrl_5;
logic  pciephy_ctrl_5_we;
logic  dec_pciephy_ctrl_6;
PCIEPHY_CTRL_6_t reg_pciephy_ctrl_6;
logic  pciephy_ctrl_6_we;
logic  dec_pciephy_ctrl_7;
PCIEPHY_CTRL_7_t reg_pciephy_ctrl_7;
logic  pciephy_ctrl_7_we;
logic  dec_pciephy_ctrl_8;
PCIEPHY_CTRL_8_t reg_pciephy_ctrl_8;
logic  pciephy_ctrl_8_we;
logic  dec_pciephy_ctrl_9;
PCIEPHY_CTRL_9_t reg_pciephy_ctrl_9;
logic  pciephy_ctrl_9_we;
logic  dec_pciephy_ctrl_10;
PCIEPHY_CTRL_10_t reg_pciephy_ctrl_10;
logic  pciephy_ctrl_10_we;
logic  dec_pciephy_ctrl_11;
PCIEPHY_CTRL_11_t reg_pciephy_ctrl_11;
logic  pciephy_ctrl_11_we;
logic  dec_pciephy_ctrl_12;
PCIEPHY_CTRL_12_t reg_pciephy_ctrl_12;
logic  pciephy_ctrl_12_we;
logic  dec_pciephy_ctrl_13;
PCIEPHY_CTRL_13_t reg_pciephy_ctrl_13;
logic  pciephy_ctrl_13_we;
logic  dec_pciephy_ctrl_14;
PCIEPHY_CTRL_14_t reg_pciephy_ctrl_14;
logic  pciephy_ctrl_14_we;
logic  dec_pciephy_ctrl_15;
PCIEPHY_CTRL_15_t reg_pciephy_ctrl_15;
logic  pciephy_ctrl_15_we;
logic  dec_pciephy_ctrl_16;
PCIEPHY_CTRL_16_t reg_pciephy_ctrl_16;
logic  pciephy_ctrl_16_we;
logic  dec_pciephy_ctrl_17;
PCIEPHY_CTRL_17_t reg_pciephy_ctrl_17;
logic  pciephy_ctrl_17_we;
logic  dec_pciephy_ctrl_18;
PCIEPHY_CTRL_18_t reg_pciephy_ctrl_18;
logic  pciephy_ctrl_18_we;
logic  dec_pciephy_ctrl_19;
PCIEPHY_CTRL_19_t reg_pciephy_ctrl_19;
logic  pciephy_ctrl_19_we;
logic  dec_pciephy_ctrl_20;
PCIEPHY_CTRL_20_t reg_pciephy_ctrl_20;
logic  pciephy_ctrl_20_we;
logic  dec_pciephy_ctrl_21;
PCIEPHY_CTRL_21_t reg_pciephy_ctrl_21;
logic  pciephy_ctrl_21_we;
logic  dec_pciephy_ctrl_22;
PCIEPHY_CTRL_22_t reg_pciephy_ctrl_22;
logic  pciephy_ctrl_22_we;
logic  dec_pciephy_ctrl_23;
PCIEPHY_CTRL_23_t reg_pciephy_ctrl_23;
logic  pciephy_ctrl_23_we;
logic  dec_pciephy_ctrl_24;
PCIEPHY_CTRL_24_t reg_pciephy_ctrl_24;
logic  pciephy_ctrl_24_we;
logic  dec_pciephy_ctrl_25;
PCIEPHY_CTRL_25_t reg_pciephy_ctrl_25;
logic  pciephy_ctrl_25_we;
logic  dec_pciephy_ctrl_26;
PCIEPHY_CTRL_26_t reg_pciephy_ctrl_26;
logic  pciephy_ctrl_26_we;
logic  dec_pciephy_ctrl_27;
PCIEPHY_CTRL_27_t reg_pciephy_ctrl_27;
logic  pciephy_ctrl_27_we;
logic  dec_pciephy_ctrl_28;
PCIEPHY_CTRL_28_t reg_pciephy_ctrl_28;
logic  pciephy_ctrl_28_we;
logic  dec_pciephy_ctrl_29;
PCIEPHY_CTRL_29_t reg_pciephy_ctrl_29;
logic  pciephy_ctrl_29_we;
logic  dec_pciephy_ctrl_30;
PCIEPHY_CTRL_30_t reg_pciephy_ctrl_30;
logic  pciephy_ctrl_30_we;
logic  dec_pciephy_ctrl_31;
PCIEPHY_CTRL_31_t reg_pciephy_ctrl_31;
logic  pciephy_ctrl_31_we;
logic  dec_pciephy_ctrl_32;
PCIEPHY_CTRL_32_t reg_pciephy_ctrl_32;
logic  pciephy_ctrl_32_we;
logic  dec_pciephy_ctrl_33;
PCIEPHY_CTRL_33_t reg_pciephy_ctrl_33;
logic  pciephy_ctrl_33_we;
logic  dec_pciephy_ctrl_34;
PCIEPHY_CTRL_34_t reg_pciephy_ctrl_34;
logic  pciephy_ctrl_34_we;
logic  dec_pciephy_ctrl_35;
PCIEPHY_CTRL_35_t reg_pciephy_ctrl_35;
logic  pciephy_ctrl_35_we;
logic  dec_pciephy_ctrl_36;
PCIEPHY_CTRL_36_t reg_pciephy_ctrl_36;
logic  pciephy_ctrl_36_we;
logic  dec_pciephy_ctrl_37;
PCIEPHY_CTRL_37_t reg_pciephy_ctrl_37;
logic  pciephy_ctrl_37_we;
logic  dec_pciephy_ctrl_38;
PCIEPHY_CTRL_38_t reg_pciephy_ctrl_38;
logic  pciephy_ctrl_38_we;
logic  dec_pciephy_ctrl_39;
PCIEPHY_CTRL_39_t reg_pciephy_ctrl_39;
logic  pciephy_ctrl_39_we;
logic  dec_pciephy_ctrl_40;
PCIEPHY_CTRL_40_t reg_pciephy_ctrl_40;
logic  pciephy_ctrl_40_we;
logic  dec_pciephy_ctrl_41;
PCIEPHY_CTRL_41_t reg_pciephy_ctrl_41;
logic  pciephy_ctrl_41_we;
logic  dec_pciephy_ctrl_42;
PCIEPHY_CTRL_42_t reg_pciephy_ctrl_42;
logic  pciephy_ctrl_42_we;
logic  dec_pciephy_ctrl_43;
PCIEPHY_CTRL_43_t reg_pciephy_ctrl_43;
logic  pciephy_ctrl_43_we;
logic  dec_pciephy_ctrl_44;
PCIEPHY_CTRL_44_t reg_pciephy_ctrl_44;
logic  pciephy_ctrl_44_we;
logic  dec_pciephy_ctrl_45;
PCIEPHY_CTRL_45_t reg_pciephy_ctrl_45;
logic  pciephy_ctrl_45_we;
logic  dec_pciephy_ctrl_46;
PCIEPHY_CTRL_46_t reg_pciephy_ctrl_46;
logic  pciephy_ctrl_46_we;
logic  dec_pciephy_ctrl_47;
PCIEPHY_CTRL_47_t reg_pciephy_ctrl_47;
logic  pciephy_ctrl_47_we;
logic  dec_pciephy_ctrl_48;
PCIEPHY_CTRL_48_t reg_pciephy_ctrl_48;
logic  pciephy_ctrl_48_we;
logic  dec_pciephy_ctrl_49;
PCIEPHY_CTRL_49_t reg_pciephy_ctrl_49;
logic  pciephy_ctrl_49_we;
logic  dec_pciephy_ctrl_50;
PCIEPHY_CTRL_50_t reg_pciephy_ctrl_50;
logic  pciephy_ctrl_50_we;
logic  dec_pciephy_ctrl_51;
PCIEPHY_CTRL_51_t reg_pciephy_ctrl_51;
logic  pciephy_ctrl_51_we;
logic  dec_pciephy_ctrl_52;
PCIEPHY_CTRL_52_t reg_pciephy_ctrl_52;
logic  pciephy_ctrl_52_we;
logic  dec_pciephy_ctrl_53;
PCIEPHY_CTRL_53_t reg_pciephy_ctrl_53;
logic  pciephy_ctrl_53_we;
logic  dec_pciephy_ctrl_54;
PCIEPHY_CTRL_54_t reg_pciephy_ctrl_54;
logic  pciephy_ctrl_54_we;
logic  dec_pciephy_ctrl_55;
PCIEPHY_CTRL_55_t reg_pciephy_ctrl_55;
logic  pciephy_ctrl_55_we;
logic  dec_pciephy_ctrl_56;
PCIEPHY_CTRL_56_t reg_pciephy_ctrl_56;
logic  pciephy_ctrl_56_we;
logic  dec_pciephy_ctrl_57;
PCIEPHY_CTRL_57_t reg_pciephy_ctrl_57;
logic  pciephy_ctrl_57_we;
logic  dec_pciephy_ctrl_58;
PCIEPHY_CTRL_58_t reg_pciephy_ctrl_58;
logic  pciephy_ctrl_58_we;
logic  dec_pciephy_ctrl_59;
PCIEPHY_CTRL_59_t reg_pciephy_ctrl_59;
logic  pciephy_ctrl_59_we;
logic  dec_pciephy_ctrl_60;
PCIEPHY_CTRL_60_t reg_pciephy_ctrl_60;
logic  pciephy_ctrl_60_we;
logic  dec_pciephy_ctrl_61;
PCIEPHY_CTRL_61_t reg_pciephy_ctrl_61;
logic  pciephy_ctrl_61_we;
logic  dec_pciephy_ctrl_62;
PCIEPHY_CTRL_62_t reg_pciephy_ctrl_62;
logic  pciephy_ctrl_62_we;
logic  dec_pciephy_ctrl_63;
PCIEPHY_CTRL_63_t reg_pciephy_ctrl_63;
logic  pciephy_ctrl_63_we;
logic  dec_pciephy_ctrl_64;
PCIEPHY_CTRL_64_t reg_pciephy_ctrl_64;
logic  pciephy_ctrl_64_we;
logic  dec_pciephy_ctrl_65;
PCIEPHY_CTRL_65_t reg_pciephy_ctrl_65;
logic  pciephy_ctrl_65_we;
logic  dec_pciephy_ctrl_66;
PCIEPHY_CTRL_66_t reg_pciephy_ctrl_66;
logic  pciephy_ctrl_66_we;
logic  dec_pciephy_ctrl_67;
PCIEPHY_CTRL_67_t reg_pciephy_ctrl_67;
logic  pciephy_ctrl_67_we;
logic  dec_pciephy_ctrl_68;
PCIEPHY_CTRL_68_t reg_pciephy_ctrl_68;
logic  pciephy_ctrl_68_we;
logic  dec_pciephy_ctrl_69;
PCIEPHY_CTRL_69_t reg_pciephy_ctrl_69;
logic  pciephy_ctrl_69_we;
logic  dec_pciephy_ctrl_70;
PCIEPHY_CTRL_70_t reg_pciephy_ctrl_70;
logic  pciephy_ctrl_70_we;
logic  dec_pciephy_ctrl_71;
PCIEPHY_CTRL_71_t reg_pciephy_ctrl_71;
logic  pciephy_ctrl_71_we;
logic  dec_pciephy_ctrl_72;
PCIEPHY_CTRL_72_t reg_pciephy_ctrl_72;
logic  pciephy_ctrl_72_we;
logic  dec_pciephy_ctrl_73;
PCIEPHY_CTRL_73_t reg_pciephy_ctrl_73;
logic  pciephy_ctrl_73_we;
logic  dec_pciephy_ctrl_74;
PCIEPHY_CTRL_74_t reg_pciephy_ctrl_74;
logic  pciephy_ctrl_74_we;
logic  dec_pciephy_ctrl_75;
PCIEPHY_CTRL_75_t reg_pciephy_ctrl_75;
logic  pciephy_ctrl_75_we;
logic  dec_pciephy_ctrl_76;
PCIEPHY_CTRL_76_t reg_pciephy_ctrl_76;
logic  pciephy_ctrl_76_we;
logic  dec_pciephy_ctrl_77;
PCIEPHY_CTRL_77_t reg_pciephy_ctrl_77;
logic  pciephy_ctrl_77_we;
logic  dec_pciephy_ctrl_78;
PCIEPHY_CTRL_78_t reg_pciephy_ctrl_78;
logic  pciephy_ctrl_78_we;
logic  dec_pciephy_ctrl_79;
PCIEPHY_CTRL_79_t reg_pciephy_ctrl_79;
logic  pciephy_ctrl_79_we;
logic  dec_pciephy_ctrl_80;
PCIEPHY_CTRL_80_t reg_pciephy_ctrl_80;
logic  pciephy_ctrl_80_we;
logic  dec_pciephy_ctrl_81;
PCIEPHY_CTRL_81_t reg_pciephy_ctrl_81;
logic  pciephy_ctrl_81_we;
logic  dec_pciephy_ctrl_82;
PCIEPHY_CTRL_82_t reg_pciephy_ctrl_82;
logic  pciephy_ctrl_82_we;
logic  dec_pciephy_ctrl_83;
PCIEPHY_CTRL_83_t reg_pciephy_ctrl_83;
logic  pciephy_ctrl_83_we;
logic  dec_pciephy_ctrl_84;
PCIEPHY_CTRL_84_t reg_pciephy_ctrl_84;
logic  pciephy_ctrl_84_we;
logic  dec_pciephy_ctrl_85;
PCIEPHY_CTRL_85_t reg_pciephy_ctrl_85;
logic  pciephy_ctrl_85_we;
logic  dec_pciephy_ctrl_86;
PCIEPHY_CTRL_86_t reg_pciephy_ctrl_86;
logic  pciephy_ctrl_86_we;
logic  dec_pciephy_ctrl_87;
PCIEPHY_CTRL_87_t reg_pciephy_ctrl_87;
logic  pciephy_ctrl_87_we;
logic  dec_pciephy_ctrl_88;
PCIEPHY_CTRL_88_t reg_pciephy_ctrl_88;
logic  pciephy_ctrl_88_we;
logic  dec_pciephy_ctrl_89;
PCIEPHY_CTRL_89_t reg_pciephy_ctrl_89;
logic  pciephy_ctrl_89_we;
logic  dec_pciephy_ctrl_90;
PCIEPHY_CTRL_90_t reg_pciephy_ctrl_90;
logic  pciephy_ctrl_90_we;
logic  dec_pciephy_ctrl_91;
PCIEPHY_CTRL_91_t reg_pciephy_ctrl_91;
logic  pciephy_ctrl_91_we;
logic  dec_pciephy_ctrl_92;
PCIEPHY_CTRL_92_t reg_pciephy_ctrl_92;
logic  pciephy_ctrl_92_we;
logic  dec_pciephy_ctrl_93;
PCIEPHY_CTRL_93_t reg_pciephy_ctrl_93;
logic  pciephy_ctrl_93_we;
logic  dec_pciephy_ctrl_94;
PCIEPHY_CTRL_94_t reg_pciephy_ctrl_94;
logic  pciephy_ctrl_94_we;
logic  dec_pciephy_ctrl_95;
PCIEPHY_CTRL_95_t reg_pciephy_ctrl_95;
logic  pciephy_ctrl_95_we;
logic  dec_pciephy_ctrl_96;
PCIEPHY_CTRL_96_t reg_pciephy_ctrl_96;
logic  pciephy_ctrl_96_we;
logic  dec_pciephy_ctrl_97;
PCIEPHY_CTRL_97_t reg_pciephy_ctrl_97;
logic  pciephy_ctrl_97_we;
logic  dec_pciephy_ctrl_98;
PCIEPHY_CTRL_98_t reg_pciephy_ctrl_98;
logic  pciephy_ctrl_98_we;
logic  dec_pciephy_ctrl_99;
PCIEPHY_CTRL_99_t reg_pciephy_ctrl_99;
logic  pciephy_ctrl_99_we;
logic  dec_pciephy_ctrl_100;
PCIEPHY_CTRL_100_t reg_pciephy_ctrl_100;
logic  pciephy_ctrl_100_we;
logic  dec_pciephy_ctrl_101;
PCIEPHY_CTRL_101_t reg_pciephy_ctrl_101;
logic  pciephy_ctrl_101_we;
logic  dec_pciephy_ctrl_102;
PCIEPHY_CTRL_102_t reg_pciephy_ctrl_102;
logic  pciephy_ctrl_102_we;
logic  dec_pciephy_ctrl_103;
PCIEPHY_CTRL_103_t reg_pciephy_ctrl_103;
logic  pciephy_ctrl_103_we;
logic  dec_pciephy_ctrl_104;
PCIEPHY_CTRL_104_t reg_pciephy_ctrl_104;
logic  pciephy_ctrl_104_we;
logic  dec_pciephy_ctrl_105;
PCIEPHY_CTRL_105_t reg_pciephy_ctrl_105;
logic  pciephy_ctrl_105_we;
logic  dec_pciephy_ctrl_106;
PCIEPHY_CTRL_106_t reg_pciephy_ctrl_106;
logic  pciephy_ctrl_106_we;
logic  dec_pciephy_ctrl_107;
PCIEPHY_CTRL_107_t reg_pciephy_ctrl_107;
logic  pciephy_ctrl_107_we;
logic  dec_pciephy_ctrl_108;
PCIEPHY_CTRL_108_t reg_pciephy_ctrl_108;
logic  pciephy_ctrl_108_we;
logic  dec_pciephy_ctrl_109;
PCIEPHY_CTRL_109_t reg_pciephy_ctrl_109;
logic  pciephy_ctrl_109_we;
logic  dec_pciephy_ctrl_110;
PCIEPHY_CTRL_110_t reg_pciephy_ctrl_110;
logic  pciephy_ctrl_110_we;
logic  dec_pciephy_ctrl_111;
PCIEPHY_CTRL_111_t reg_pciephy_ctrl_111;
logic  pciephy_ctrl_111_we;
logic  dec_pciephy_ctrl_112;
PCIEPHY_CTRL_112_t reg_pciephy_ctrl_112;
logic  pciephy_ctrl_112_we;
logic  dec_pciephy_ctrl_113;
PCIEPHY_CTRL_113_t reg_pciephy_ctrl_113;
logic  pciephy_ctrl_113_we;
logic  dec_pciephy_ctrl_114;
PCIEPHY_CTRL_114_t reg_pciephy_ctrl_114;
logic  pciephy_ctrl_114_we;
logic  dec_pciephy_ctrl_115;
PCIEPHY_CTRL_115_t reg_pciephy_ctrl_115;
logic  pciephy_ctrl_115_we;
logic  dec_pciephy_ctrl_116;
PCIEPHY_CTRL_116_t reg_pciephy_ctrl_116;
logic  pciephy_ctrl_116_we;
logic  dec_pciephy_ctrl_117;
PCIEPHY_CTRL_117_t reg_pciephy_ctrl_117;
logic  pciephy_ctrl_117_we;
logic  dec_pciephy_ctrl_118;
PCIEPHY_CTRL_118_t reg_pciephy_ctrl_118;
logic  pciephy_ctrl_118_we;
logic  dec_pciephy_ctrl_119;
PCIEPHY_CTRL_119_t reg_pciephy_ctrl_119;
logic  pciephy_ctrl_119_we;
logic  dec_pciephy_ctrl_120;
PCIEPHY_CTRL_120_t reg_pciephy_ctrl_120;
logic  pciephy_ctrl_120_we;
logic  dec_pciephy_ctrl_121;
PCIEPHY_CTRL_121_t reg_pciephy_ctrl_121;
logic  pciephy_ctrl_121_we;
logic  dec_pciephy_ctrl_122;
PCIEPHY_CTRL_122_t reg_pciephy_ctrl_122;
logic  pciephy_ctrl_122_we;
logic  dec_pciephy_ctrl_123;
PCIEPHY_CTRL_123_t reg_pciephy_ctrl_123;
logic  pciephy_ctrl_123_we;
logic  dec_pciephy_ctrl_124;
PCIEPHY_CTRL_124_t reg_pciephy_ctrl_124;
logic  pciephy_ctrl_124_we;
logic  dec_pciephy_ctrl_125;
PCIEPHY_CTRL_125_t reg_pciephy_ctrl_125;
logic  pciephy_ctrl_125_we;
logic  dec_pciephy_ctrl_126;
PCIEPHY_CTRL_126_t reg_pciephy_ctrl_126;
logic  pciephy_ctrl_126_we;
logic  dec_pciephy_ctrl_127;
PCIEPHY_CTRL_127_t reg_pciephy_ctrl_127;
logic  pciephy_ctrl_127_we;
logic  dec_pciephy_ctrl_128;
PCIEPHY_CTRL_128_t reg_pciephy_ctrl_128;
logic  pciephy_ctrl_128_we;
logic  dec_pciephy_ctrl_129;
PCIEPHY_CTRL_129_t reg_pciephy_ctrl_129;
logic  pciephy_ctrl_129_we;
logic  dec_pciephy_ctrl_130;
PCIEPHY_CTRL_130_t reg_pciephy_ctrl_130;
logic  pciephy_ctrl_130_we;
logic  dec_pciephy_ctrl_131;
PCIEPHY_CTRL_131_t reg_pciephy_ctrl_131;
logic  pciephy_ctrl_131_we;
logic  dec_pciephy_ctrl_132;
PCIEPHY_CTRL_132_t reg_pciephy_ctrl_132;
logic  pciephy_ctrl_132_we;
logic  dec_pciephy_ctrl_133;
PCIEPHY_CTRL_133_t reg_pciephy_ctrl_133;
logic  pciephy_ctrl_133_we;
logic  dec_pciephy_ctrl_134;
PCIEPHY_CTRL_134_t reg_pciephy_ctrl_134;
logic  pciephy_ctrl_134_we;
logic  dec_pciephy_ctrl_135;
PCIEPHY_CTRL_135_t reg_pciephy_ctrl_135;
logic  pciephy_ctrl_135_we;
logic  dec_pciephy_ctrl_136;
PCIEPHY_CTRL_136_t reg_pciephy_ctrl_136;
logic  pciephy_ctrl_136_we;
logic  dec_pciephy_ctrl_137;
PCIEPHY_CTRL_137_t reg_pciephy_ctrl_137;
logic  pciephy_ctrl_137_we;
logic  dec_pciephy_ctrl_138;
PCIEPHY_CTRL_138_t reg_pciephy_ctrl_138;
logic  pciephy_ctrl_138_we;
logic  dec_pciephy_ctrl_139;
PCIEPHY_CTRL_139_t reg_pciephy_ctrl_139;
logic  pciephy_ctrl_139_we;
logic  dec_pciephy_ctrl_140;
PCIEPHY_CTRL_140_t reg_pciephy_ctrl_140;
logic  pciephy_ctrl_140_we;
logic  dec_pciephy_ctrl_141;
PCIEPHY_CTRL_141_t reg_pciephy_ctrl_141;
logic  pciephy_ctrl_141_we;
logic  dec_pciephy_ctrl_142;
PCIEPHY_CTRL_142_t reg_pciephy_ctrl_142;
logic  pciephy_ctrl_142_we;
logic  dec_pciephy_ctrl_143;
PCIEPHY_CTRL_143_t reg_pciephy_ctrl_143;
logic  pciephy_ctrl_143_we;
logic  dec_pciephy_ctrl_144;
PCIEPHY_CTRL_144_t reg_pciephy_ctrl_144;
logic  pciephy_ctrl_144_we;
logic  dec_pciephy_ctrl_145;
PCIEPHY_CTRL_145_t reg_pciephy_ctrl_145;
logic  pciephy_ctrl_145_we;
logic  dec_pciephy_ctrl_146;
PCIEPHY_CTRL_146_t reg_pciephy_ctrl_146;
logic  pciephy_ctrl_146_we;
logic  dec_pciephy_ctrl_147;
PCIEPHY_CTRL_147_t reg_pciephy_ctrl_147;
logic  pciephy_ctrl_147_we;
logic  dec_pciephy_ctrl_148;
PCIEPHY_CTRL_148_t reg_pciephy_ctrl_148;
logic  pciephy_ctrl_148_we;
logic  dec_pciephy_ctrl_149;
PCIEPHY_CTRL_149_t reg_pciephy_ctrl_149;
logic  pciephy_ctrl_149_we;
logic  dec_pciephy_ctrl_150;
PCIEPHY_CTRL_150_t reg_pciephy_ctrl_150;
logic  pciephy_ctrl_150_we;
logic  dec_pciephy_ctrl_151;
PCIEPHY_CTRL_151_t reg_pciephy_ctrl_151;
logic  pciephy_ctrl_151_we;
logic  dec_pciephy_ctrl_152;
PCIEPHY_CTRL_152_t reg_pciephy_ctrl_152;
logic  pciephy_ctrl_152_we;
logic  dec_pciephy_ctrl_153;
PCIEPHY_CTRL_153_t reg_pciephy_ctrl_153;
logic  pciephy_ctrl_153_we;
logic  dec_pciephy_ctrl_154;
PCIEPHY_CTRL_154_t reg_pciephy_ctrl_154;
logic  pciephy_ctrl_154_we;
logic  dec_pciephy_ctrl_155;
PCIEPHY_CTRL_155_t reg_pciephy_ctrl_155;
logic  pciephy_ctrl_155_we;
logic  dec_pciephy_ctrl_156;
PCIEPHY_CTRL_156_t reg_pciephy_ctrl_156;
logic  pciephy_ctrl_156_we;
logic  dec_pciephy_ctrl_157;
PCIEPHY_CTRL_157_t reg_pciephy_ctrl_157;
logic  pciephy_ctrl_157_we;
logic  dec_pciephy_ctrl_158;
PCIEPHY_CTRL_158_t reg_pciephy_ctrl_158;
logic  pciephy_ctrl_158_we;
logic  dec_pciephy_ctrl_159;
PCIEPHY_CTRL_159_t reg_pciephy_ctrl_159;
logic  pciephy_ctrl_159_we;
logic  dec_pciephy_ctrl_160;
PCIEPHY_CTRL_160_t reg_pciephy_ctrl_160;
logic  pciephy_ctrl_160_we;
logic  dec_pciephy_ctrl_161;
PCIEPHY_CTRL_161_t reg_pciephy_ctrl_161;
logic  pciephy_ctrl_161_we;
logic  dec_pciephy_ctrl_162;
PCIEPHY_CTRL_162_t reg_pciephy_ctrl_162;
logic  pciephy_ctrl_162_we;
logic  dec_pciephy_ctrl_163;
PCIEPHY_CTRL_163_t reg_pciephy_ctrl_163;
logic  pciephy_ctrl_163_we;
logic  dec_pciephy_ctrl_164;
PCIEPHY_CTRL_164_t reg_pciephy_ctrl_164;
logic  pciephy_ctrl_164_we;
logic  dec_pciephy_ctrl_165;
PCIEPHY_CTRL_165_t reg_pciephy_ctrl_165;
logic  pciephy_ctrl_165_we;
logic  dec_pciephy_ctrl_166;
PCIEPHY_CTRL_166_t reg_pciephy_ctrl_166;
logic  pciephy_ctrl_166_we;
logic  dec_pciephy_ctrl_167;
PCIEPHY_CTRL_167_t reg_pciephy_ctrl_167;
logic  pciephy_ctrl_167_we;
logic  dec_pciephy_ctrl_168;
PCIEPHY_CTRL_168_t reg_pciephy_ctrl_168;
logic  pciephy_ctrl_168_we;
logic  dec_pciephy_ctrl_169;
PCIEPHY_CTRL_169_t reg_pciephy_ctrl_169;
logic  pciephy_ctrl_169_we;
logic  dec_pciephy_ctrl_170;
PCIEPHY_CTRL_170_t reg_pciephy_ctrl_170;
logic  pciephy_ctrl_170_we;
logic  dec_pciephy_ctrl_171;
PCIEPHY_CTRL_171_t reg_pciephy_ctrl_171;
logic  pciephy_ctrl_171_we;
logic  dec_pciephy_ctrl_172;
PCIEPHY_CTRL_172_t reg_pciephy_ctrl_172;
logic  pciephy_ctrl_172_we;
logic  dec_pciephy_ctrl_173;
PCIEPHY_CTRL_173_t reg_pciephy_ctrl_173;
logic  pciephy_ctrl_173_we;
logic  dec_pciephy_ctrl_174;
PCIEPHY_CTRL_174_t reg_pciephy_ctrl_174;
logic  pciephy_ctrl_174_we;
logic  dec_pciephy_ctrl_175;
PCIEPHY_CTRL_175_t reg_pciephy_ctrl_175;
logic  pciephy_ctrl_175_we;
logic  dec_pciephy_ctrl_176;
PCIEPHY_CTRL_176_t reg_pciephy_ctrl_176;
logic  pciephy_ctrl_176_we;
logic  dec_pciephy_ctrl_177;
PCIEPHY_CTRL_177_t reg_pciephy_ctrl_177;
logic  pciephy_ctrl_177_we;
logic  dec_pciephy_ctrl_178;
PCIEPHY_CTRL_178_t reg_pciephy_ctrl_178;
logic  pciephy_ctrl_178_we;
logic  dec_pciephy_ctrl_179;
PCIEPHY_CTRL_179_t reg_pciephy_ctrl_179;
logic  pciephy_ctrl_179_we;
logic  dec_pciephy_ctrl_180;
PCIEPHY_CTRL_180_t reg_pciephy_ctrl_180;
logic  pciephy_ctrl_180_we;
logic  dec_pciephy_ctrl_181;
PCIEPHY_CTRL_181_t reg_pciephy_ctrl_181;
logic  pciephy_ctrl_181_we;
logic  dec_pciephy_ctrl_182;
PCIEPHY_CTRL_182_t reg_pciephy_ctrl_182;
logic  pciephy_ctrl_182_we;
logic  dec_pciephy_ctrl_183;
PCIEPHY_CTRL_183_t reg_pciephy_ctrl_183;
logic  pciephy_ctrl_183_we;
logic  dec_pciephy_ctrl_184;
PCIEPHY_CTRL_184_t reg_pciephy_ctrl_184;
logic  pciephy_ctrl_184_we;
logic  dec_pciephy_ctrl_185;
PCIEPHY_CTRL_185_t reg_pciephy_ctrl_185;
logic  pciephy_ctrl_185_we;
logic  dec_pciephy_ctrl_186;
PCIEPHY_CTRL_186_t reg_pciephy_ctrl_186;
logic  pciephy_ctrl_186_we;
logic  dec_pciephy_ctrl_187;
PCIEPHY_CTRL_187_t reg_pciephy_ctrl_187;
logic  pciephy_ctrl_187_we;
logic  dec_pciephy_ctrl_188;
PCIEPHY_CTRL_188_t reg_pciephy_ctrl_188;
logic  pciephy_ctrl_188_we;
logic  dec_pciephy_ctrl_189;
PCIEPHY_CTRL_189_t reg_pciephy_ctrl_189;
logic  pciephy_ctrl_189_we;
logic  dec_pciephy_ctrl_190;
PCIEPHY_CTRL_190_t reg_pciephy_ctrl_190;
logic  pciephy_ctrl_190_we;
logic  dec_pciephy_ctrl_191;
PCIEPHY_CTRL_191_t reg_pciephy_ctrl_191;
logic  pciephy_ctrl_191_we;
logic  dec_pciephy_ctrl_192;
PCIEPHY_CTRL_192_t reg_pciephy_ctrl_192;
logic  pciephy_ctrl_192_we;
logic  dec_pciephy_ctrl_193;
PCIEPHY_CTRL_193_t reg_pciephy_ctrl_193;
logic  pciephy_ctrl_193_we;
logic  dec_pciephy_ctrl_194;
PCIEPHY_CTRL_194_t reg_pciephy_ctrl_194;
logic  pciephy_ctrl_194_we;
logic  dec_pciephy_ctrl_195;
PCIEPHY_CTRL_195_t reg_pciephy_ctrl_195;
logic  pciephy_ctrl_195_we;
logic  dec_pciephy_ctrl_196;
PCIEPHY_CTRL_196_t reg_pciephy_ctrl_196;
logic  pciephy_ctrl_196_we;
logic  dec_pciephy_ctrl_197;
PCIEPHY_CTRL_197_t reg_pciephy_ctrl_197;
logic  pciephy_ctrl_197_we;
logic  dec_pciephy_ctrl_198;
PCIEPHY_CTRL_198_t reg_pciephy_ctrl_198;
logic  pciephy_ctrl_198_we;
logic  dec_pciephy_ctrl_199;
PCIEPHY_CTRL_199_t reg_pciephy_ctrl_199;
logic  pciephy_ctrl_199_we;
logic  dec_pciephy_ctrl_200;
PCIEPHY_CTRL_200_t reg_pciephy_ctrl_200;
logic  pciephy_ctrl_200_we;
logic  dec_pciephy_ctrl_201;
PCIEPHY_CTRL_201_t reg_pciephy_ctrl_201;
logic  pciephy_ctrl_201_we;
logic  dec_pciephy_ctrl_202;
PCIEPHY_CTRL_202_t reg_pciephy_ctrl_202;
logic  pciephy_ctrl_202_we;
logic  dec_pciephy_ctrl_203;
PCIEPHY_CTRL_203_t reg_pciephy_ctrl_203;
logic  pciephy_ctrl_203_we;
logic  dec_pciephy_ctrl_204;
PCIEPHY_CTRL_204_t reg_pciephy_ctrl_204;
logic  pciephy_ctrl_204_we;
logic  dec_pciephy_ctrl_205;
PCIEPHY_CTRL_205_t reg_pciephy_ctrl_205;
logic  pciephy_ctrl_205_we;
logic  dec_pciephy_ctrl_206;
PCIEPHY_CTRL_206_t reg_pciephy_ctrl_206;
logic  pciephy_ctrl_206_we;
logic  dec_pciephy_ctrl_207;
PCIEPHY_CTRL_207_t reg_pciephy_ctrl_207;
logic  pciephy_ctrl_207_we;
logic  dec_pciephy_ctrl_208;
PCIEPHY_CTRL_208_t reg_pciephy_ctrl_208;
logic  pciephy_ctrl_208_we;
logic  dec_pciephy_ctrl_209;
PCIEPHY_CTRL_209_t reg_pciephy_ctrl_209;
logic  pciephy_ctrl_209_we;
logic  dec_pciephy_ctrl_210;
PCIEPHY_CTRL_210_t reg_pciephy_ctrl_210;
logic  pciephy_ctrl_210_we;
logic  dec_pciephy_ctrl_211;
PCIEPHY_CTRL_211_t reg_pciephy_ctrl_211;
logic  pciephy_ctrl_211_we;
logic  dec_pciephy_ctrl_212;
PCIEPHY_CTRL_212_t reg_pciephy_ctrl_212;
logic  pciephy_ctrl_212_we;
logic  dec_pciephy_ctrl_213;
PCIEPHY_CTRL_213_t reg_pciephy_ctrl_213;
logic  pciephy_ctrl_213_we;
logic  dec_pciephy_ctrl_214;
PCIEPHY_CTRL_214_t reg_pciephy_ctrl_214;
logic  pciephy_ctrl_214_we;
logic  dec_pciephy_ctrl_215;
PCIEPHY_CTRL_215_t reg_pciephy_ctrl_215;
logic  pciephy_ctrl_215_we;
logic  dec_pciephy_ctrl_216;
PCIEPHY_CTRL_216_t reg_pciephy_ctrl_216;
logic  pciephy_ctrl_216_we;
logic  dec_pciephy_ctrl_217;
PCIEPHY_CTRL_217_t reg_pciephy_ctrl_217;
logic  pciephy_ctrl_217_we;
logic  dec_pciephy_ctrl_218;
PCIEPHY_CTRL_218_t reg_pciephy_ctrl_218;
logic  pciephy_ctrl_218_we;
logic  dec_pciephy_ctrl_219;
PCIEPHY_CTRL_219_t reg_pciephy_ctrl_219;
logic  pciephy_ctrl_219_we;
logic  dec_pciephy_ctrl_220;
PCIEPHY_CTRL_220_t reg_pciephy_ctrl_220;
logic  pciephy_ctrl_220_we;
logic  dec_pciephy_ctrl_221;
PCIEPHY_CTRL_221_t reg_pciephy_ctrl_221;
logic  pciephy_ctrl_221_we;
logic  dec_pciephy_ctrl_222;
PCIEPHY_CTRL_222_t reg_pciephy_ctrl_222;
logic  pciephy_ctrl_222_we;
logic  dec_pciephy_ctrl_223;
PCIEPHY_CTRL_223_t reg_pciephy_ctrl_223;
logic  pciephy_ctrl_223_we;
logic  dec_pciephy_ctrl_224;
PCIEPHY_CTRL_224_t reg_pciephy_ctrl_224;
logic  pciephy_ctrl_224_we;
logic  dec_pciephy_ctrl_225;
PCIEPHY_CTRL_225_t reg_pciephy_ctrl_225;
logic  pciephy_ctrl_225_we;
logic  dec_pciephy_ctrl_226;
PCIEPHY_CTRL_226_t reg_pciephy_ctrl_226;
logic  pciephy_ctrl_226_we;
logic  dec_pciephy_ctrl_227;
PCIEPHY_CTRL_227_t reg_pciephy_ctrl_227;
logic  pciephy_ctrl_227_we;
logic  dec_pciephy_ctrl_228;
PCIEPHY_CTRL_228_t reg_pciephy_ctrl_228;
logic  pciephy_ctrl_228_we;
logic  dec_pciephy_ctrl_229;
PCIEPHY_CTRL_229_t reg_pciephy_ctrl_229;
logic  pciephy_ctrl_229_we;
logic  dec_pciephy_ctrl_230;
PCIEPHY_CTRL_230_t reg_pciephy_ctrl_230;
logic  pciephy_ctrl_230_we;
logic  dec_pciephy_ctrl_231;
PCIEPHY_CTRL_231_t reg_pciephy_ctrl_231;
logic  pciephy_ctrl_231_we;
logic  dec_pciephy_ctrl_232;
PCIEPHY_CTRL_232_t reg_pciephy_ctrl_232;
logic  pciephy_ctrl_232_we;
logic  dec_pciephy_ctrl_233;
PCIEPHY_CTRL_233_t reg_pciephy_ctrl_233;
logic  pciephy_ctrl_233_we;
logic  dec_pciephy_ctrl_234;
PCIEPHY_CTRL_234_t reg_pciephy_ctrl_234;
logic  pciephy_ctrl_234_we;
logic  dec_pciephy_ctrl_235;
PCIEPHY_CTRL_235_t reg_pciephy_ctrl_235;
logic  pciephy_ctrl_235_we;
logic  dec_pciephy_ctrl_236;
PCIEPHY_CTRL_236_t reg_pciephy_ctrl_236;
logic  pciephy_ctrl_236_we;
logic  dec_pciephy_ctrl_237;
PCIEPHY_CTRL_237_t reg_pciephy_ctrl_237;
logic  pciephy_ctrl_237_we;
logic  dec_pciephy_ctrl_238;
PCIEPHY_CTRL_238_t reg_pciephy_ctrl_238;
logic  pciephy_ctrl_238_we;
logic  dec_pciephy_ctrl_239;
PCIEPHY_CTRL_239_t reg_pciephy_ctrl_239;
logic  pciephy_ctrl_239_we;
logic  dec_pciephy_ctrl_240;
PCIEPHY_CTRL_240_t reg_pciephy_ctrl_240;
logic  pciephy_ctrl_240_we;
logic  dec_pciephy_ctrl_241;
PCIEPHY_CTRL_241_t reg_pciephy_ctrl_241;
logic  pciephy_ctrl_241_we;
logic  dec_pciephy_ctrl_242;
PCIEPHY_CTRL_242_t reg_pciephy_ctrl_242;
logic  pciephy_ctrl_242_we;
logic  dec_pciephy_ctrl_243;
PCIEPHY_CTRL_243_t reg_pciephy_ctrl_243;
logic  pciephy_ctrl_243_we;
logic  dec_pciephy_ctrl_244;
PCIEPHY_CTRL_244_t reg_pciephy_ctrl_244;
logic  pciephy_ctrl_244_we;
logic  dec_pciephy_ctrl_245;
PCIEPHY_CTRL_245_t reg_pciephy_ctrl_245;
logic  pciephy_ctrl_245_we;
logic  dec_pciephy_ctrl_246;
PCIEPHY_CTRL_246_t reg_pciephy_ctrl_246;
logic  pciephy_ctrl_246_we;
logic  dec_pciephy_ctrl_247;
PCIEPHY_CTRL_247_t reg_pciephy_ctrl_247;
logic  pciephy_ctrl_247_we;
logic  dec_pciephy_ctrl_248;
PCIEPHY_CTRL_248_t reg_pciephy_ctrl_248;
logic  pciephy_ctrl_248_we;
logic  dec_pciephy_ctrl_249;
PCIEPHY_CTRL_249_t reg_pciephy_ctrl_249;
logic  pciephy_ctrl_249_we;
logic  dec_pciephy_ctrl_250;
PCIEPHY_CTRL_250_t reg_pciephy_ctrl_250;
logic  pciephy_ctrl_250_we;
logic  dec_pciephy_ctrl_251;
PCIEPHY_CTRL_251_t reg_pciephy_ctrl_251;
logic  pciephy_ctrl_251_we;
logic  dec_pciephy_ctrl_252;
PCIEPHY_CTRL_252_t reg_pciephy_ctrl_252;
logic  pciephy_ctrl_252_we;
logic  dec_pciephy_ctrl_253;
PCIEPHY_CTRL_253_t reg_pciephy_ctrl_253;
logic  pciephy_ctrl_253_we;
logic  dec_pciephy_ctrl_254;
PCIEPHY_CTRL_254_t reg_pciephy_ctrl_254;
logic  pciephy_ctrl_254_we;
logic  dec_pciephy_ctrl_255;
PCIEPHY_CTRL_255_t reg_pciephy_ctrl_255;
logic  pciephy_ctrl_255_we;
logic  dec_pciephy_ctrl_256;
PCIEPHY_CTRL_256_t reg_pciephy_ctrl_256;
logic  pciephy_ctrl_256_we;
logic  dec_pciephy_ctrl_257;
PCIEPHY_CTRL_257_t reg_pciephy_ctrl_257;
logic  pciephy_ctrl_257_we;
logic  dec_pciephy_ctrl_258;
PCIEPHY_CTRL_258_t reg_pciephy_ctrl_258;
logic  pciephy_ctrl_258_we;
logic  dec_pciephy_ctrl_259;
PCIEPHY_CTRL_259_t reg_pciephy_ctrl_259;
logic  pciephy_ctrl_259_we;
logic  dec_pciephy_ctrl_260;
PCIEPHY_CTRL_260_t reg_pciephy_ctrl_260;
logic  pciephy_ctrl_260_we;
logic  dec_pciephy_ctrl_261;
PCIEPHY_CTRL_261_t reg_pciephy_ctrl_261;
logic  pciephy_ctrl_261_we;
logic  dec_pciephy_ctrl_262;
PCIEPHY_CTRL_262_t reg_pciephy_ctrl_262;
logic  pciephy_ctrl_262_we;
logic  dec_pciephy_ctrl_263;
PCIEPHY_CTRL_263_t reg_pciephy_ctrl_263;
logic  pciephy_ctrl_263_we;
logic  dec_pciephy_ctrl_264;
PCIEPHY_CTRL_264_t reg_pciephy_ctrl_264;
logic  pciephy_ctrl_264_we;
logic  dec_pciephy_ctrl_265;
PCIEPHY_CTRL_265_t reg_pciephy_ctrl_265;
logic  pciephy_ctrl_265_we;
logic  dec_pciephy_ctrl_266;
PCIEPHY_CTRL_266_t reg_pciephy_ctrl_266;
logic  pciephy_ctrl_266_we;
logic  dec_pciephy_ctrl_267;
PCIEPHY_CTRL_267_t reg_pciephy_ctrl_267;
logic  pciephy_ctrl_267_we;
logic  dec_pciephy_ctrl_268;
PCIEPHY_CTRL_268_t reg_pciephy_ctrl_268;
logic  pciephy_ctrl_268_we;
logic  dec_pciephy_ctrl_269;
PCIEPHY_CTRL_269_t reg_pciephy_ctrl_269;
logic  pciephy_ctrl_269_we;
logic  dec_pciephy_ctrl_270;
PCIEPHY_CTRL_270_t reg_pciephy_ctrl_270;
logic  pciephy_ctrl_270_we;
logic  dec_pciephy_ctrl_271;
PCIEPHY_CTRL_271_t reg_pciephy_ctrl_271;
logic  pciephy_ctrl_271_we;
logic  dec_pciephy_ctrl_272;
PCIEPHY_CTRL_272_t reg_pciephy_ctrl_272;
logic  pciephy_ctrl_272_we;
logic  dec_pciephy_ctrl_273;
PCIEPHY_CTRL_273_t reg_pciephy_ctrl_273;
logic  pciephy_ctrl_273_we;
logic  dec_pciephy_ctrl_274;
PCIEPHY_CTRL_274_t reg_pciephy_ctrl_274;
logic  pciephy_ctrl_274_we;
logic  dec_pciephy_ctrl_275;
PCIEPHY_CTRL_275_t reg_pciephy_ctrl_275;
logic  pciephy_ctrl_275_we;
logic  dec_pciephy_ctrl_276;
PCIEPHY_CTRL_276_t reg_pciephy_ctrl_276;
logic  pciephy_ctrl_276_we;
logic  dec_pciephy_ctrl_277;
PCIEPHY_CTRL_277_t reg_pciephy_ctrl_277;
logic  pciephy_ctrl_277_we;
logic  dec_pciephy_ctrl_278;
PCIEPHY_CTRL_278_t reg_pciephy_ctrl_278;
logic  pciephy_ctrl_278_we;
logic  dec_pciephy_ctrl_279;
PCIEPHY_CTRL_279_t reg_pciephy_ctrl_279;
logic  pciephy_ctrl_279_we;
logic  dec_pciephy_ctrl_280;
PCIEPHY_CTRL_280_t reg_pciephy_ctrl_280;
logic  pciephy_ctrl_280_we;
logic  dec_pciephy_ctrl_281;
PCIEPHY_CTRL_281_t reg_pciephy_ctrl_281;
logic  pciephy_ctrl_281_we;
logic  dec_pciephy_ctrl_282;
PCIEPHY_CTRL_282_t reg_pciephy_ctrl_282;
logic  pciephy_ctrl_282_we;
logic  dec_pciephy_ctrl_283;
PCIEPHY_CTRL_283_t reg_pciephy_ctrl_283;
logic  pciephy_ctrl_283_we;
logic  dec_pciephy_ctrl_284;
PCIEPHY_CTRL_284_t reg_pciephy_ctrl_284;
logic  pciephy_ctrl_284_we;
logic  dec_pciephy_ctrl_285;
PCIEPHY_CTRL_285_t reg_pciephy_ctrl_285;
logic  pciephy_ctrl_285_we;
logic  dec_pciephy_ctrl_286;
PCIEPHY_CTRL_286_t reg_pciephy_ctrl_286;
logic  pciephy_ctrl_286_we;
logic  dec_pciephy_ctrl_287;
PCIEPHY_CTRL_287_t reg_pciephy_ctrl_287;
logic  pciephy_ctrl_287_we;
logic  dec_pciephy_ctrl_288;
PCIEPHY_CTRL_288_t reg_pciephy_ctrl_288;
logic  pciephy_ctrl_288_we;
logic  dec_pciephy_ctrl_289;
PCIEPHY_CTRL_289_t reg_pciephy_ctrl_289;
logic  pciephy_ctrl_289_we;
logic  dec_pciephy_ctrl_290;
PCIEPHY_CTRL_290_t reg_pciephy_ctrl_290;
logic  pciephy_ctrl_290_we;
logic  dec_pciephy_ctrl_291;
PCIEPHY_CTRL_291_t reg_pciephy_ctrl_291;
logic  pciephy_ctrl_291_we;
logic  dec_pciephy_ctrl_292;
PCIEPHY_CTRL_292_t reg_pciephy_ctrl_292;
logic  pciephy_ctrl_292_we;
logic  dec_pciephy_ctrl_293;
PCIEPHY_CTRL_293_t reg_pciephy_ctrl_293;
logic  pciephy_ctrl_293_we;
logic  dec_pciephy_ctrl_294;
PCIEPHY_CTRL_294_t reg_pciephy_ctrl_294;
logic  pciephy_ctrl_294_we;
logic  dec_pciephy_ctrl_295;
PCIEPHY_CTRL_295_t reg_pciephy_ctrl_295;
logic  pciephy_ctrl_295_we;
logic  dec_pciephy_ctrl_296;
PCIEPHY_CTRL_296_t reg_pciephy_ctrl_296;
logic  pciephy_ctrl_296_we;
logic  dec_pciephy_ctrl_297;
PCIEPHY_CTRL_297_t reg_pciephy_ctrl_297;
logic  pciephy_ctrl_297_we;
logic  dec_pciephy_ctrl_298;
PCIEPHY_CTRL_298_t reg_pciephy_ctrl_298;
logic  pciephy_ctrl_298_we;
logic  dec_pciephy_ctrl_299;
PCIEPHY_CTRL_299_t reg_pciephy_ctrl_299;
logic  pciephy_ctrl_299_we;
logic  dec_pciephy_ctrl_300;
PCIEPHY_CTRL_300_t reg_pciephy_ctrl_300;
logic  pciephy_ctrl_300_we;
logic  dec_pciephy_ctrl_301;
PCIEPHY_CTRL_301_t reg_pciephy_ctrl_301;
logic  pciephy_ctrl_301_we;
logic  dec_pciephy_ctrl_302;
PCIEPHY_CTRL_302_t reg_pciephy_ctrl_302;
logic  pciephy_ctrl_302_we;
logic  dec_pciephy_ctrl_303;
PCIEPHY_CTRL_303_t reg_pciephy_ctrl_303;
logic  pciephy_ctrl_303_we;
logic  dec_pciephy_ctrl_304;
PCIEPHY_CTRL_304_t reg_pciephy_ctrl_304;
logic  pciephy_ctrl_304_we;
logic  dec_pciephy_ctrl_305;
PCIEPHY_CTRL_305_t reg_pciephy_ctrl_305;
logic  pciephy_ctrl_305_we;
logic  dec_pciephy_ctrl_306;
PCIEPHY_CTRL_306_t reg_pciephy_ctrl_306;
logic  pciephy_ctrl_306_we;
logic  dec_pciephy_ctrl_307;
PCIEPHY_CTRL_307_t reg_pciephy_ctrl_307;
logic  pciephy_ctrl_307_we;
logic  dec_pciephy_ctrl_308;
PCIEPHY_CTRL_308_t reg_pciephy_ctrl_308;
logic  pciephy_ctrl_308_we;
logic  dec_pciephy_ctrl_309;
PCIEPHY_CTRL_309_t reg_pciephy_ctrl_309;
logic  pciephy_ctrl_309_we;
logic  dec_pciephy_ctrl_310;
PCIEPHY_CTRL_310_t reg_pciephy_ctrl_310;
logic  pciephy_ctrl_310_we;
logic  dec_pciephy_ctrl_311;
PCIEPHY_CTRL_311_t reg_pciephy_ctrl_311;
logic  pciephy_ctrl_311_we;
logic  dec_pciephy_ctrl_312;
PCIEPHY_CTRL_312_t reg_pciephy_ctrl_312;
logic  pciephy_ctrl_312_we;
logic  dec_pciephy_ctrl_313;
PCIEPHY_CTRL_313_t reg_pciephy_ctrl_313;
logic  pciephy_ctrl_313_we;
logic  dec_pciephy_ctrl_314;
PCIEPHY_CTRL_314_t reg_pciephy_ctrl_314;
logic  pciephy_ctrl_314_we;
logic  dec_pciephy_ctrl_315;
PCIEPHY_CTRL_315_t reg_pciephy_ctrl_315;
logic  pciephy_ctrl_315_we;
logic  dec_pciephy_ctrl_316;
PCIEPHY_CTRL_316_t reg_pciephy_ctrl_316;
logic  pciephy_ctrl_316_we;
logic  dec_pciephy_ctrl_317;
PCIEPHY_CTRL_317_t reg_pciephy_ctrl_317;
logic  pciephy_ctrl_317_we;
logic  dec_pciephy_ctrl_318;
PCIEPHY_CTRL_318_t reg_pciephy_ctrl_318;
logic  pciephy_ctrl_318_we;
logic  dec_pciephy_ctrl_319;
PCIEPHY_CTRL_319_t reg_pciephy_ctrl_319;
logic  pciephy_ctrl_319_we;
logic  dec_pciephy_ctrl_320;
PCIEPHY_CTRL_320_t reg_pciephy_ctrl_320;
logic  pciephy_ctrl_320_we;
logic  dec_pciephy_ctrl_321;
PCIEPHY_CTRL_321_t reg_pciephy_ctrl_321;
logic  pciephy_ctrl_321_we;
logic  dec_pciephy_ctrl_322;
PCIEPHY_CTRL_322_t reg_pciephy_ctrl_322;
logic  pciephy_ctrl_322_we;
logic  dec_pciephy_ctrl_323;
PCIEPHY_CTRL_323_t reg_pciephy_ctrl_323;
logic  pciephy_ctrl_323_we;
logic  dec_pciephy_ctrl_324;
PCIEPHY_CTRL_324_t reg_pciephy_ctrl_324;
logic  pciephy_ctrl_324_we;
logic  dec_pciephy_ctrl_325;
PCIEPHY_CTRL_325_t reg_pciephy_ctrl_325;
logic  pciephy_ctrl_325_we;
logic  dec_pciephy_ctrl_326;
PCIEPHY_CTRL_326_t reg_pciephy_ctrl_326;
logic  pciephy_ctrl_326_we;
logic  dec_pciephy_ctrl_327;
PCIEPHY_CTRL_327_t reg_pciephy_ctrl_327;
logic  pciephy_ctrl_327_we;
logic  dec_pciephy_ctrl_328;
PCIEPHY_CTRL_328_t reg_pciephy_ctrl_328;
logic  pciephy_ctrl_328_we;
logic  dec_pciephy_ctrl_329;
PCIEPHY_CTRL_329_t reg_pciephy_ctrl_329;
logic  pciephy_ctrl_329_we;
logic  dec_pciephy_ctrl_330;
PCIEPHY_CTRL_330_t reg_pciephy_ctrl_330;
logic  pciephy_ctrl_330_we;
logic  dec_pciephy_ctrl_331;
PCIEPHY_CTRL_331_t reg_pciephy_ctrl_331;
logic  pciephy_ctrl_331_we;
logic  dec_pciephy_ctrl_332;
PCIEPHY_CTRL_332_t reg_pciephy_ctrl_332;
logic  pciephy_ctrl_332_we;
logic  dec_pciephy_ctrl_333;
PCIEPHY_CTRL_333_t reg_pciephy_ctrl_333;
logic  pciephy_ctrl_333_we;
logic  dec_pciephy_ctrl_334;
PCIEPHY_CTRL_334_t reg_pciephy_ctrl_334;
logic  pciephy_ctrl_334_we;
logic  dec_pciephy_ctrl_335;
PCIEPHY_CTRL_335_t reg_pciephy_ctrl_335;
logic  pciephy_ctrl_335_we;
logic  dec_pciephy_ctrl_336;
PCIEPHY_CTRL_336_t reg_pciephy_ctrl_336;
logic  pciephy_ctrl_336_we;
logic  dec_pciephy_ctrl_337;
PCIEPHY_CTRL_337_t reg_pciephy_ctrl_337;
logic  pciephy_ctrl_337_we;
logic  dec_pciephy_ctrl_338;
PCIEPHY_CTRL_338_t reg_pciephy_ctrl_338;
logic  pciephy_ctrl_338_we;
logic  dec_pciephy_ctrl_339;
PCIEPHY_CTRL_339_t reg_pciephy_ctrl_339;
logic  pciephy_ctrl_339_we;
logic  dec_pciephy_ctrl_340;
PCIEPHY_CTRL_340_t reg_pciephy_ctrl_340;
logic  pciephy_ctrl_340_we;
logic  dec_pciephy_ctrl_341;
PCIEPHY_CTRL_341_t reg_pciephy_ctrl_341;
logic  pciephy_ctrl_341_we;
logic  dec_pciephy_ctrl_342;
PCIEPHY_CTRL_342_t reg_pciephy_ctrl_342;
logic  pciephy_ctrl_342_we;
logic  dec_pciephy_ctrl_343;
PCIEPHY_CTRL_343_t reg_pciephy_ctrl_343;
logic  pciephy_ctrl_343_we;
logic  dec_pciephy_ctrl_344;
PCIEPHY_CTRL_344_t reg_pciephy_ctrl_344;
logic  pciephy_ctrl_344_we;
logic  dec_pciephy_ctrl_345;
PCIEPHY_CTRL_345_t reg_pciephy_ctrl_345;
logic  pciephy_ctrl_345_we;
logic  dec_pciephy_ctrl_346;
PCIEPHY_CTRL_346_t reg_pciephy_ctrl_346;
logic  pciephy_ctrl_346_we;
logic  dec_pciephy_ctrl_347;
PCIEPHY_CTRL_347_t reg_pciephy_ctrl_347;
logic  pciephy_ctrl_347_we;
logic  dec_pciephy_ctrl_348;
PCIEPHY_CTRL_348_t reg_pciephy_ctrl_348;
logic  pciephy_ctrl_348_we;
logic  dec_pciephy_ctrl_349;
PCIEPHY_CTRL_349_t reg_pciephy_ctrl_349;
logic  pciephy_ctrl_349_we;
logic  dec_pciephy_ctrl_350;
PCIEPHY_CTRL_350_t reg_pciephy_ctrl_350;
logic  pciephy_ctrl_350_we;
logic  dec_pciephy_ctrl_351;
PCIEPHY_CTRL_351_t reg_pciephy_ctrl_351;
logic  pciephy_ctrl_351_we;
logic  dec_pciephy_ctrl_352;
PCIEPHY_CTRL_352_t reg_pciephy_ctrl_352;
logic  pciephy_ctrl_352_we;
logic  dec_pciephy_ctrl_353;
PCIEPHY_CTRL_353_t reg_pciephy_ctrl_353;
logic  pciephy_ctrl_353_we;
logic  dec_pciephy_ctrl_354;
PCIEPHY_CTRL_354_t reg_pciephy_ctrl_354;
logic  pciephy_ctrl_354_we;
logic  dec_pciephy_ctrl_355;
PCIEPHY_CTRL_355_t reg_pciephy_ctrl_355;
logic  pciephy_ctrl_355_we;
logic  dec_pciephy_ctrl_356;
PCIEPHY_CTRL_356_t reg_pciephy_ctrl_356;
logic  pciephy_ctrl_356_we;
logic  dec_pciephy_ctrl_357;
PCIEPHY_CTRL_357_t reg_pciephy_ctrl_357;
logic  pciephy_ctrl_357_we;
logic  dec_pciephy_ctrl_358;
PCIEPHY_CTRL_358_t reg_pciephy_ctrl_358;
logic  pciephy_ctrl_358_we;
logic  dec_pciephy_ctrl_359;
PCIEPHY_CTRL_359_t reg_pciephy_ctrl_359;
logic  pciephy_ctrl_359_we;
logic  dec_pciephy_ctrl_360;
PCIEPHY_CTRL_360_t reg_pciephy_ctrl_360;
logic  pciephy_ctrl_360_we;
logic  dec_pciephy_ctrl_361;
PCIEPHY_CTRL_361_t reg_pciephy_ctrl_361;
logic  pciephy_ctrl_361_we;
logic  dec_pciephy_ctrl_362;
PCIEPHY_CTRL_362_t reg_pciephy_ctrl_362;
logic  pciephy_ctrl_362_we;
logic  dec_pciephy_ctrl_363;
PCIEPHY_CTRL_363_t reg_pciephy_ctrl_363;
logic  pciephy_ctrl_363_we;
logic  dec_pciephy_ctrl_364;
PCIEPHY_CTRL_364_t reg_pciephy_ctrl_364;
logic  pciephy_ctrl_364_we;
logic  dec_pciephy_ctrl_365;
PCIEPHY_CTRL_365_t reg_pciephy_ctrl_365;
logic  pciephy_ctrl_365_we;
logic  dec_pciephy_ctrl_366;
PCIEPHY_CTRL_366_t reg_pciephy_ctrl_366;
logic  pciephy_ctrl_366_we;
logic  dec_pciephy_ctrl_367;
PCIEPHY_CTRL_367_t reg_pciephy_ctrl_367;
logic  pciephy_ctrl_367_we;
logic  dec_pciephy_ctrl_368;
PCIEPHY_CTRL_368_t reg_pciephy_ctrl_368;
logic  pciephy_ctrl_368_we;
logic  dec_pciephy_ctrl_369;
PCIEPHY_CTRL_369_t reg_pciephy_ctrl_369;
logic  pciephy_ctrl_369_we;
logic  dec_pciephy_ctrl_370;
PCIEPHY_CTRL_370_t reg_pciephy_ctrl_370;
logic  pciephy_ctrl_370_we;
logic  dec_pciephy_ctrl_371;
PCIEPHY_CTRL_371_t reg_pciephy_ctrl_371;
logic  pciephy_ctrl_371_we;
logic  dec_pciephy_ctrl_372;
PCIEPHY_CTRL_372_t reg_pciephy_ctrl_372;
logic  pciephy_ctrl_372_we;
logic  dec_pciephy_ctrl_373;
PCIEPHY_CTRL_373_t reg_pciephy_ctrl_373;
logic  pciephy_ctrl_373_we;
logic  dec_pciephy_ctrl_374;
PCIEPHY_CTRL_374_t reg_pciephy_ctrl_374;
logic  pciephy_ctrl_374_we;
logic  dec_pciephy_ctrl_375;
PCIEPHY_CTRL_375_t reg_pciephy_ctrl_375;
logic  pciephy_ctrl_375_we;
logic  dec_pciephy_ctrl_376;
PCIEPHY_CTRL_376_t reg_pciephy_ctrl_376;
logic  pciephy_ctrl_376_we;
logic  dec_pciephy_ctrl_377;
PCIEPHY_CTRL_377_t reg_pciephy_ctrl_377;
logic  pciephy_ctrl_377_we;
logic  dec_pciephy_ctrl_378;
PCIEPHY_CTRL_378_t reg_pciephy_ctrl_378;
logic  pciephy_ctrl_378_we;
logic  dec_pciephy_ctrl_379;
PCIEPHY_CTRL_379_t reg_pciephy_ctrl_379;
logic  pciephy_ctrl_379_we;
logic  dec_pciephy_ctrl_380;
PCIEPHY_CTRL_380_t reg_pciephy_ctrl_380;
logic  pciephy_ctrl_380_we;
logic  dec_pciephy_ctrl_381;
PCIEPHY_CTRL_381_t reg_pciephy_ctrl_381;
logic  pciephy_ctrl_381_we;
logic  dec_pciephy_ctrl_382;
PCIEPHY_CTRL_382_t reg_pciephy_ctrl_382;
logic  pciephy_ctrl_382_we;
logic  dec_pciephy_ctrl_383;
PCIEPHY_CTRL_383_t reg_pciephy_ctrl_383;
logic  pciephy_ctrl_383_we;
logic  dec_pciephy_ctrl_384;
PCIEPHY_CTRL_384_t reg_pciephy_ctrl_384;
logic  pciephy_ctrl_384_we;
logic  dec_pciephy_ctrl_385;
PCIEPHY_CTRL_385_t reg_pciephy_ctrl_385;
logic  pciephy_ctrl_385_we;
logic  dec_pciephy_ctrl_386;
PCIEPHY_CTRL_386_t reg_pciephy_ctrl_386;
logic  pciephy_ctrl_386_we;
logic  dec_pciephy_ctrl_387;
PCIEPHY_CTRL_387_t reg_pciephy_ctrl_387;
logic  pciephy_ctrl_387_we;
logic  dec_pciephy_ctrl_388;
PCIEPHY_CTRL_388_t reg_pciephy_ctrl_388;
logic  pciephy_ctrl_388_we;
logic  dec_pciephy_ctrl_389;
PCIEPHY_CTRL_389_t reg_pciephy_ctrl_389;
logic  pciephy_ctrl_389_we;
logic  dec_pciephy_ctrl_390;
PCIEPHY_CTRL_390_t reg_pciephy_ctrl_390;
logic  pciephy_ctrl_390_we;
logic  dec_pciephy_ctrl_391;
PCIEPHY_CTRL_391_t reg_pciephy_ctrl_391;
logic  pciephy_ctrl_391_we;
logic  dec_pciephy_ctrl_392;
PCIEPHY_CTRL_392_t reg_pciephy_ctrl_392;
logic  pciephy_ctrl_392_we;
logic  dec_pciephy_ctrl_393;
PCIEPHY_CTRL_393_t reg_pciephy_ctrl_393;
logic  pciephy_ctrl_393_we;
logic  dec_pciephy_ctrl_394;
PCIEPHY_CTRL_394_t reg_pciephy_ctrl_394;
logic  pciephy_ctrl_394_we;
logic  dec_pciephy_ctrl_395;
PCIEPHY_CTRL_395_t reg_pciephy_ctrl_395;
logic  pciephy_ctrl_395_we;
logic  dec_pciephy_ctrl_396;
PCIEPHY_CTRL_396_t reg_pciephy_ctrl_396;
logic  pciephy_ctrl_396_we;
logic  dec_pciephy_ctrl_397;
PCIEPHY_CTRL_397_t reg_pciephy_ctrl_397;
logic  pciephy_ctrl_397_we;
logic  dec_pciephy_ctrl_398;
PCIEPHY_CTRL_398_t reg_pciephy_ctrl_398;
logic  pciephy_ctrl_398_we;
logic  dec_pciephy_ctrl_399;
PCIEPHY_CTRL_399_t reg_pciephy_ctrl_399;
logic  pciephy_ctrl_399_we;
logic  dec_pciephy_ctrl_400;
PCIEPHY_CTRL_400_t reg_pciephy_ctrl_400;
logic  pciephy_ctrl_400_we;
logic  dec_pciephy_ctrl_401;
PCIEPHY_CTRL_401_t reg_pciephy_ctrl_401;
logic  pciephy_ctrl_401_we;
logic  dec_pciephy_ctrl_402;
PCIEPHY_CTRL_402_t reg_pciephy_ctrl_402;
logic  pciephy_ctrl_402_we;
logic  dec_pciephy_ctrl_403;
PCIEPHY_CTRL_403_t reg_pciephy_ctrl_403;
logic  pciephy_ctrl_403_we;
logic  dec_pciephy_ctrl_404;
PCIEPHY_CTRL_404_t reg_pciephy_ctrl_404;
logic  pciephy_ctrl_404_we;
logic  dec_pciephy_ctrl_405;
PCIEPHY_CTRL_405_t reg_pciephy_ctrl_405;
logic  pciephy_ctrl_405_we;
logic  dec_pciephy_ctrl_406;
PCIEPHY_CTRL_406_t reg_pciephy_ctrl_406;
logic  pciephy_ctrl_406_we;
logic  dec_pciephy_ctrl_407;
PCIEPHY_CTRL_407_t reg_pciephy_ctrl_407;
logic  pciephy_ctrl_407_we;
logic  dec_pciephy_ctrl_408;
PCIEPHY_CTRL_408_t reg_pciephy_ctrl_408;
logic  pciephy_ctrl_408_we;
logic  dec_pciephy_ctrl_409;
PCIEPHY_CTRL_409_t reg_pciephy_ctrl_409;
logic  pciephy_ctrl_409_we;
logic  dec_pciephy_ctrl_410;
PCIEPHY_CTRL_410_t reg_pciephy_ctrl_410;
logic  pciephy_ctrl_410_we;
logic  dec_pciephy_ctrl_411;
PCIEPHY_CTRL_411_t reg_pciephy_ctrl_411;
logic  pciephy_ctrl_411_we;
logic  dec_pciephy_ctrl_412;
PCIEPHY_CTRL_412_t reg_pciephy_ctrl_412;
logic  pciephy_ctrl_412_we;
logic  dec_pciephy_ctrl_413;
PCIEPHY_CTRL_413_t reg_pciephy_ctrl_413;
logic  pciephy_ctrl_413_we;
logic  dec_pciephy_ctrl_414;
PCIEPHY_CTRL_414_t reg_pciephy_ctrl_414;
logic  pciephy_ctrl_414_we;
logic  dec_pciephy_ctrl_415;
PCIEPHY_CTRL_415_t reg_pciephy_ctrl_415;
logic  pciephy_ctrl_415_we;
logic  dec_pciephy_ctrl_416;
PCIEPHY_CTRL_416_t reg_pciephy_ctrl_416;
logic  pciephy_ctrl_416_we;
logic  dec_pciephy_ctrl_417;
PCIEPHY_CTRL_417_t reg_pciephy_ctrl_417;
logic  pciephy_ctrl_417_we;
logic  dec_pciephy_ctrl_418;
PCIEPHY_CTRL_418_t reg_pciephy_ctrl_418;
logic  pciephy_ctrl_418_we;
logic  dec_pciephy_ctrl_419;
PCIEPHY_CTRL_419_t reg_pciephy_ctrl_419;
logic  pciephy_ctrl_419_we;
logic  dec_pciephy_ctrl_420;
PCIEPHY_CTRL_420_t reg_pciephy_ctrl_420;
logic  pciephy_ctrl_420_we;
logic  dec_pciephy_ctrl_421;
PCIEPHY_CTRL_421_t reg_pciephy_ctrl_421;
logic  pciephy_ctrl_421_we;
logic  dec_pciephy_ctrl_422;
PCIEPHY_CTRL_422_t reg_pciephy_ctrl_422;
logic  pciephy_ctrl_422_we;
logic  dec_pciephy_ctrl_423;
PCIEPHY_CTRL_423_t reg_pciephy_ctrl_423;
logic  pciephy_ctrl_423_we;
logic  dec_pciephy_ctrl_424;
PCIEPHY_CTRL_424_t reg_pciephy_ctrl_424;
logic  pciephy_ctrl_424_we;
logic  dec_pciephy_ctrl_425;
PCIEPHY_CTRL_425_t reg_pciephy_ctrl_425;
logic  pciephy_ctrl_425_we;
logic  dec_pciephy_ctrl_426;
PCIEPHY_CTRL_426_t reg_pciephy_ctrl_426;
logic  pciephy_ctrl_426_we;
logic  dec_pciephy_ctrl_427;
PCIEPHY_CTRL_427_t reg_pciephy_ctrl_427;
logic  pciephy_ctrl_427_we;
logic  dec_pciephy_ctrl_428;
PCIEPHY_CTRL_428_t reg_pciephy_ctrl_428;
logic  pciephy_ctrl_428_we;
logic  dec_pciephy_ctrl_429;
PCIEPHY_CTRL_429_t reg_pciephy_ctrl_429;
logic  pciephy_ctrl_429_we;
logic  dec_pciephy_ctrl_430;
PCIEPHY_CTRL_430_t reg_pciephy_ctrl_430;
logic  pciephy_ctrl_430_we;
logic  dec_pciephy_ctrl_431;
PCIEPHY_CTRL_431_t reg_pciephy_ctrl_431;
logic  pciephy_ctrl_431_we;
logic  dec_pciephy_ctrl_432;
PCIEPHY_CTRL_432_t reg_pciephy_ctrl_432;
logic  pciephy_ctrl_432_we;
logic  dec_pciephy_ctrl_433;
PCIEPHY_CTRL_433_t reg_pciephy_ctrl_433;
logic  pciephy_ctrl_433_we;
logic  dec_pciephy_ctrl_434;
PCIEPHY_CTRL_434_t reg_pciephy_ctrl_434;
logic  pciephy_ctrl_434_we;
logic  dec_pciephy_ctrl_435;
PCIEPHY_CTRL_435_t reg_pciephy_ctrl_435;
logic  pciephy_ctrl_435_we;
logic  dec_pciephy_ctrl_436;
PCIEPHY_CTRL_436_t reg_pciephy_ctrl_436;
logic  pciephy_ctrl_436_we;
logic  dec_pciephy_ctrl_437;
PCIEPHY_CTRL_437_t reg_pciephy_ctrl_437;
logic  pciephy_ctrl_437_we;
logic  dec_pciephy_ctrl_438;
PCIEPHY_CTRL_438_t reg_pciephy_ctrl_438;
logic  pciephy_ctrl_438_we;
logic  dec_pciephy_ctrl_439;
PCIEPHY_CTRL_439_t reg_pciephy_ctrl_439;
logic  pciephy_ctrl_439_we;
logic  dec_pciephy_ctrl_440;
PCIEPHY_CTRL_440_t reg_pciephy_ctrl_440;
logic  pciephy_ctrl_440_we;
logic  dec_pciephy_ctrl_441;
PCIEPHY_CTRL_441_t reg_pciephy_ctrl_441;
logic  pciephy_ctrl_441_we;
logic  dec_pciephy_ctrl_442;
PCIEPHY_CTRL_442_t reg_pciephy_ctrl_442;
logic  pciephy_ctrl_442_we;
logic  dec_pciephy_ctrl_443;
PCIEPHY_CTRL_443_t reg_pciephy_ctrl_443;
logic  pciephy_ctrl_443_we;
logic  dec_pciephy_ctrl_444;
PCIEPHY_CTRL_444_t reg_pciephy_ctrl_444;
logic  pciephy_ctrl_444_we;
logic  dec_pciephy_ctrl_445;
PCIEPHY_CTRL_445_t reg_pciephy_ctrl_445;
logic  pciephy_ctrl_445_we;
logic  dec_pciephy_ctrl_446;
PCIEPHY_CTRL_446_t reg_pciephy_ctrl_446;
logic  pciephy_ctrl_446_we;
logic  dec_pciephy_ctrl_447;
PCIEPHY_CTRL_447_t reg_pciephy_ctrl_447;
logic  pciephy_ctrl_447_we;
logic  dec_pciephy_ctrl_448;
PCIEPHY_CTRL_448_t reg_pciephy_ctrl_448;
logic  pciephy_ctrl_448_we;
logic  dec_pciephy_ctrl_449;
PCIEPHY_CTRL_449_t reg_pciephy_ctrl_449;
logic  pciephy_ctrl_449_we;
logic  dec_pciephy_ctrl_450;
PCIEPHY_CTRL_450_t reg_pciephy_ctrl_450;
logic  pciephy_ctrl_450_we;
logic  dec_pciephy_ctrl_451;
PCIEPHY_CTRL_451_t reg_pciephy_ctrl_451;
logic  pciephy_ctrl_451_we;
logic  dec_pciephy_ctrl_452;
PCIEPHY_CTRL_452_t reg_pciephy_ctrl_452;
logic  pciephy_ctrl_452_we;
logic  dec_pciephy_ctrl_453;
PCIEPHY_CTRL_453_t reg_pciephy_ctrl_453;
logic  pciephy_ctrl_453_we;
logic  dec_pciephy_ctrl_454;
PCIEPHY_CTRL_454_t reg_pciephy_ctrl_454;
logic  pciephy_ctrl_454_we;
logic  dec_pciephy_ctrl_455;
PCIEPHY_CTRL_455_t reg_pciephy_ctrl_455;
logic  pciephy_ctrl_455_we;
logic  dec_pciephy_ctrl_456;
PCIEPHY_CTRL_456_t reg_pciephy_ctrl_456;
logic  pciephy_ctrl_456_we;
logic  dec_pciephy_ctrl_457;
PCIEPHY_CTRL_457_t reg_pciephy_ctrl_457;
logic  pciephy_ctrl_457_we;
logic  dec_pciephy_ctrl_458;
PCIEPHY_CTRL_458_t reg_pciephy_ctrl_458;
logic  pciephy_ctrl_458_we;
logic  dec_pciephy_ctrl_459;
PCIEPHY_CTRL_459_t reg_pciephy_ctrl_459;
logic  pciephy_ctrl_459_we;
logic  dec_pciephy_ctrl_460;
PCIEPHY_CTRL_460_t reg_pciephy_ctrl_460;
logic  pciephy_ctrl_460_we;
logic  dec_pciephy_ctrl_461;
PCIEPHY_CTRL_461_t reg_pciephy_ctrl_461;
logic  pciephy_ctrl_461_we;
logic  dec_pciephy_ctrl_462;
PCIEPHY_CTRL_462_t reg_pciephy_ctrl_462;
logic  pciephy_ctrl_462_we;
logic  dec_pciephy_ctrl_463;
PCIEPHY_CTRL_463_t reg_pciephy_ctrl_463;
logic  pciephy_ctrl_463_we;
logic  dec_pciephy_ctrl_464;
PCIEPHY_CTRL_464_t reg_pciephy_ctrl_464;
logic  pciephy_ctrl_464_we;
logic  dec_pciephy_ctrl_465;
PCIEPHY_CTRL_465_t reg_pciephy_ctrl_465;
logic  pciephy_ctrl_465_we;
logic  dec_pciephy_ctrl_466;
PCIEPHY_CTRL_466_t reg_pciephy_ctrl_466;
logic  pciephy_ctrl_466_we;
logic  dec_pciephy_ctrl_467;
PCIEPHY_CTRL_467_t reg_pciephy_ctrl_467;
logic  pciephy_ctrl_467_we;
logic  dec_pciephy_ctrl_468;
PCIEPHY_CTRL_468_t reg_pciephy_ctrl_468;
logic  pciephy_ctrl_468_we;
logic  dec_pciephy_ctrl_469;
PCIEPHY_CTRL_469_t reg_pciephy_ctrl_469;
logic  pciephy_ctrl_469_we;
logic  dec_pciephy_ctrl_470;
PCIEPHY_CTRL_470_t reg_pciephy_ctrl_470;
logic  pciephy_ctrl_470_we;
logic  dec_pciephy_ctrl_471;
PCIEPHY_CTRL_471_t reg_pciephy_ctrl_471;
logic  pciephy_ctrl_471_we;
logic  dec_pciephy_ctrl_472;
PCIEPHY_CTRL_472_t reg_pciephy_ctrl_472;
logic  pciephy_ctrl_472_we;
logic  dec_pciephy_ctrl_473;
PCIEPHY_CTRL_473_t reg_pciephy_ctrl_473;
logic  pciephy_ctrl_473_we;
logic  dec_pciephy_ctrl_474;
PCIEPHY_CTRL_474_t reg_pciephy_ctrl_474;
logic  pciephy_ctrl_474_we;
logic  dec_pciephy_ctrl_475;
PCIEPHY_CTRL_475_t reg_pciephy_ctrl_475;
logic  pciephy_ctrl_475_we;
logic  dec_pciephy_ctrl_476;
PCIEPHY_CTRL_476_t reg_pciephy_ctrl_476;
logic  pciephy_ctrl_476_we;
logic  dec_pciephy_ctrl_477;
PCIEPHY_CTRL_477_t reg_pciephy_ctrl_477;
logic  pciephy_ctrl_477_we;
logic  dec_pciephy_ctrl_478;
PCIEPHY_CTRL_478_t reg_pciephy_ctrl_478;
logic  pciephy_ctrl_478_we;
logic  dec_pciephy_ctrl_479;
PCIEPHY_CTRL_479_t reg_pciephy_ctrl_479;
logic  pciephy_ctrl_479_we;
logic  dec_pciephy_ctrl_480;
PCIEPHY_CTRL_480_t reg_pciephy_ctrl_480;
logic  pciephy_ctrl_480_we;
logic  dec_pciephy_ctrl_481;
PCIEPHY_CTRL_481_t reg_pciephy_ctrl_481;
logic  pciephy_ctrl_481_we;
logic  dec_pciephy_ctrl_482;
PCIEPHY_CTRL_482_t reg_pciephy_ctrl_482;
logic  pciephy_ctrl_482_we;
logic  dec_pciephy_ctrl_483;
PCIEPHY_CTRL_483_t reg_pciephy_ctrl_483;
logic  pciephy_ctrl_483_we;
logic  dec_pciephy_ctrl_484;
PCIEPHY_CTRL_484_t reg_pciephy_ctrl_484;
logic  pciephy_ctrl_484_we;
logic  dec_pciephy_ctrl_485;
PCIEPHY_CTRL_485_t reg_pciephy_ctrl_485;
logic  pciephy_ctrl_485_we;
logic  dec_pciephy_ctrl_486;
PCIEPHY_CTRL_486_t reg_pciephy_ctrl_486;
logic  pciephy_ctrl_486_we;
logic  dec_pciephy_ctrl_487;
PCIEPHY_CTRL_487_t reg_pciephy_ctrl_487;
logic  pciephy_ctrl_487_we;
logic  dec_pciephy_ctrl_488;
PCIEPHY_CTRL_488_t reg_pciephy_ctrl_488;
logic  pciephy_ctrl_488_we;
logic  dec_pciephy_ctrl_489;
PCIEPHY_CTRL_489_t reg_pciephy_ctrl_489;
logic  pciephy_ctrl_489_we;
logic  dec_pciephy_ctrl_490;
PCIEPHY_CTRL_490_t reg_pciephy_ctrl_490;
logic  pciephy_ctrl_490_we;
logic  dec_pciephy_ctrl_491;
PCIEPHY_CTRL_491_t reg_pciephy_ctrl_491;
logic  pciephy_ctrl_491_we;
logic  dec_pciephy_ctrl_492;
PCIEPHY_CTRL_492_t reg_pciephy_ctrl_492;
logic  pciephy_ctrl_492_we;
logic  dec_pciephy_ctrl_493;
PCIEPHY_CTRL_493_t reg_pciephy_ctrl_493;
logic  pciephy_ctrl_493_we;
logic  dec_pciephy_ctrl_494;
PCIEPHY_CTRL_494_t reg_pciephy_ctrl_494;
logic  pciephy_ctrl_494_we;
logic  dec_pciephy_ctrl_495;
PCIEPHY_CTRL_495_t reg_pciephy_ctrl_495;
logic  pciephy_ctrl_495_we;
logic  dec_pciephy_ctrl_496;
PCIEPHY_CTRL_496_t reg_pciephy_ctrl_496;
logic  pciephy_ctrl_496_we;
logic  dec_pciephy_ctrl_497;
PCIEPHY_CTRL_497_t reg_pciephy_ctrl_497;
logic  pciephy_ctrl_497_we;
logic  dec_pciephy_ctrl_498;
PCIEPHY_CTRL_498_t reg_pciephy_ctrl_498;
logic  pciephy_ctrl_498_we;
logic  dec_pciephy_ctrl_499;
PCIEPHY_CTRL_499_t reg_pciephy_ctrl_499;
logic  pciephy_ctrl_499_we;
logic  dec_pciephy_ctrl_500;
PCIEPHY_CTRL_500_t reg_pciephy_ctrl_500;
logic  pciephy_ctrl_500_we;
logic  dec_pciephy_ctrl_501;
PCIEPHY_CTRL_501_t reg_pciephy_ctrl_501;
logic  pciephy_ctrl_501_we;
logic  dec_pciephy_ctrl_502;
PCIEPHY_CTRL_502_t reg_pciephy_ctrl_502;
logic  pciephy_ctrl_502_we;
logic  dec_pciephy_ctrl_503;
PCIEPHY_CTRL_503_t reg_pciephy_ctrl_503;
logic  pciephy_ctrl_503_we;
logic  dec_pciephy_ctrl_504;
PCIEPHY_CTRL_504_t reg_pciephy_ctrl_504;
logic  pciephy_ctrl_504_we;
logic  dec_pciephy_ctrl_505;
PCIEPHY_CTRL_505_t reg_pciephy_ctrl_505;
logic  pciephy_ctrl_505_we;
logic  dec_pciephy_ctrl_506;
PCIEPHY_CTRL_506_t reg_pciephy_ctrl_506;
logic  pciephy_ctrl_506_we;
logic  dec_pciephy_ctrl_507;
PCIEPHY_CTRL_507_t reg_pciephy_ctrl_507;
logic  pciephy_ctrl_507_we;
logic  dec_pciephy_ctrl_508;
PCIEPHY_CTRL_508_t reg_pciephy_ctrl_508;
logic  pciephy_ctrl_508_we;
logic  dec_pciephy_ctrl_509;
PCIEPHY_CTRL_509_t reg_pciephy_ctrl_509;
logic  pciephy_ctrl_509_we;
logic  dec_pciephy_ctrl_510;
PCIEPHY_CTRL_510_t reg_pciephy_ctrl_510;
logic  pciephy_ctrl_510_we;
logic  dec_pciephy_ctrl_511;
PCIEPHY_CTRL_511_t reg_pciephy_ctrl_511;
logic  pciephy_ctrl_511_we;
logic  dec_pciephy_ctrl_512;
PCIEPHY_CTRL_512_t reg_pciephy_ctrl_512;
logic  pciephy_ctrl_512_we;
logic  dec_pciephy_ctrl_513;
PCIEPHY_CTRL_513_t reg_pciephy_ctrl_513;
logic  pciephy_ctrl_513_we;
logic  dec_pciephy_ctrl_514;
PCIEPHY_CTRL_514_t reg_pciephy_ctrl_514;
logic  pciephy_ctrl_514_we;
logic  dec_pciephy_ctrl_515;
PCIEPHY_CTRL_515_t reg_pciephy_ctrl_515;
logic  pciephy_ctrl_515_we;
logic  dec_pciephy_ctrl_516;
PCIEPHY_CTRL_516_t reg_pciephy_ctrl_516;
logic  pciephy_ctrl_516_we;
logic  dec_pciephy_ctrl_517;
PCIEPHY_CTRL_517_t reg_pciephy_ctrl_517;
logic  pciephy_ctrl_517_we;
logic  dec_pciephy_ctrl_518;
PCIEPHY_CTRL_518_t reg_pciephy_ctrl_518;
logic  pciephy_ctrl_518_we;
logic  dec_pciephy_ctrl_519;
PCIEPHY_CTRL_519_t reg_pciephy_ctrl_519;
logic  pciephy_ctrl_519_we;
logic  dec_pciephy_ctrl_520;
PCIEPHY_CTRL_520_t reg_pciephy_ctrl_520;
logic  pciephy_ctrl_520_we;
logic  dec_pciephy_ctrl_521;
PCIEPHY_CTRL_521_t reg_pciephy_ctrl_521;
logic  pciephy_ctrl_521_we;
logic  dec_pciephy_ctrl_522;
PCIEPHY_CTRL_522_t reg_pciephy_ctrl_522;
logic  pciephy_ctrl_522_we;
logic  dec_pciephy_ctrl_523;
PCIEPHY_CTRL_523_t reg_pciephy_ctrl_523;
logic  pciephy_ctrl_523_we;
logic  dec_pciephy_ctrl_524;
PCIEPHY_CTRL_524_t reg_pciephy_ctrl_524;
logic  pciephy_ctrl_524_we;
logic  dec_pciephy_ctrl_525;
PCIEPHY_CTRL_525_t reg_pciephy_ctrl_525;
logic  pciephy_ctrl_525_we;
logic  dec_pciephy_ctrl_526;
PCIEPHY_CTRL_526_t reg_pciephy_ctrl_526;
logic  pciephy_ctrl_526_we;
logic  dec_pciephy_ctrl_527;
PCIEPHY_CTRL_527_t reg_pciephy_ctrl_527;
logic  pciephy_ctrl_527_we;
logic  dec_pciephy_ctrl_528;
PCIEPHY_CTRL_528_t reg_pciephy_ctrl_528;
logic  pciephy_ctrl_528_we;
logic  dec_pciephy_ctrl_529;
PCIEPHY_CTRL_529_t reg_pciephy_ctrl_529;
logic  pciephy_ctrl_529_we;
logic  dec_pciephy_ctrl_530;
PCIEPHY_CTRL_530_t reg_pciephy_ctrl_530;
logic  pciephy_ctrl_530_we;
logic  dec_pciephy_ctrl_531;
PCIEPHY_CTRL_531_t reg_pciephy_ctrl_531;
logic  pciephy_ctrl_531_we;
logic  dec_pciephy_ctrl_532;
PCIEPHY_CTRL_532_t reg_pciephy_ctrl_532;
logic  pciephy_ctrl_532_we;
logic  dec_pciephy_ctrl_533;
PCIEPHY_CTRL_533_t reg_pciephy_ctrl_533;
logic  pciephy_ctrl_533_we;
logic  dec_pciephy_ctrl_534;
PCIEPHY_CTRL_534_t reg_pciephy_ctrl_534;
logic  pciephy_ctrl_534_we;
logic  dec_pciephy_ctrl_535;
PCIEPHY_CTRL_535_t reg_pciephy_ctrl_535;
logic  pciephy_ctrl_535_we;
logic  dec_pciephy_ctrl_536;
PCIEPHY_CTRL_536_t reg_pciephy_ctrl_536;
logic  pciephy_ctrl_536_we;
logic  dec_pciephy_ctrl_537;
PCIEPHY_CTRL_537_t reg_pciephy_ctrl_537;
logic  pciephy_ctrl_537_we;
logic  dec_pciephy_ctrl_538;
PCIEPHY_CTRL_538_t reg_pciephy_ctrl_538;
logic  pciephy_ctrl_538_we;
logic  dec_pciephy_ctrl_539;
PCIEPHY_CTRL_539_t reg_pciephy_ctrl_539;
logic  pciephy_ctrl_539_we;
logic  dec_pciephy_ctrl_540;
PCIEPHY_CTRL_540_t reg_pciephy_ctrl_540;
logic  pciephy_ctrl_540_we;
logic  dec_pciephy_ctrl_541;
PCIEPHY_CTRL_541_t reg_pciephy_ctrl_541;
logic  pciephy_ctrl_541_we;
logic  dec_pciephy_ctrl_542;
PCIEPHY_CTRL_542_t reg_pciephy_ctrl_542;
logic  pciephy_ctrl_542_we;
logic  dec_pciephy_ctrl_543;
PCIEPHY_CTRL_543_t reg_pciephy_ctrl_543;
logic  pciephy_ctrl_543_we;
logic  dec_pciephy_ctrl_544;
PCIEPHY_CTRL_544_t reg_pciephy_ctrl_544;
logic  pciephy_ctrl_544_we;
logic  dec_pciephy_ctrl_545;
PCIEPHY_CTRL_545_t reg_pciephy_ctrl_545;
logic  pciephy_ctrl_545_we;
logic  dec_pciephy_ctrl_546;
PCIEPHY_CTRL_546_t reg_pciephy_ctrl_546;
logic  pciephy_ctrl_546_we;
logic  dec_pciephy_ctrl_547;
PCIEPHY_CTRL_547_t reg_pciephy_ctrl_547;
logic  pciephy_ctrl_547_we;
logic  dec_pciephy_ctrl_548;
PCIEPHY_CTRL_548_t reg_pciephy_ctrl_548;
logic  pciephy_ctrl_548_we;
logic  dec_pciephy_ctrl_549;
PCIEPHY_CTRL_549_t reg_pciephy_ctrl_549;
logic  pciephy_ctrl_549_we;
logic  dec_pciephy_ctrl_550;
PCIEPHY_CTRL_550_t reg_pciephy_ctrl_550;
logic  pciephy_ctrl_550_we;
logic  dec_pciephy_ctrl_551;
PCIEPHY_CTRL_551_t reg_pciephy_ctrl_551;
logic  pciephy_ctrl_551_we;
logic  dec_pciephy_ctrl_552;
PCIEPHY_CTRL_552_t reg_pciephy_ctrl_552;
logic  pciephy_ctrl_552_we;
logic  dec_pciephy_ctrl_553;
PCIEPHY_CTRL_553_t reg_pciephy_ctrl_553;
logic  pciephy_ctrl_553_we;
logic  dec_pciephy_ctrl_554;
PCIEPHY_CTRL_554_t reg_pciephy_ctrl_554;
logic  pciephy_ctrl_554_we;
logic  dec_pciephy_ctrl_555;
PCIEPHY_CTRL_555_t reg_pciephy_ctrl_555;
logic  pciephy_ctrl_555_we;
logic  dec_pciephy_ctrl_556;
PCIEPHY_CTRL_556_t reg_pciephy_ctrl_556;
logic  pciephy_ctrl_556_we;
logic  dec_pciephy_ctrl_557;
PCIEPHY_CTRL_557_t reg_pciephy_ctrl_557;
logic  pciephy_ctrl_557_we;
logic  dec_pciephy_ctrl_558;
PCIEPHY_CTRL_558_t reg_pciephy_ctrl_558;
logic  pciephy_ctrl_558_we;
logic  dec_pciephy_ctrl_559;
PCIEPHY_CTRL_559_t reg_pciephy_ctrl_559;
logic  pciephy_ctrl_559_we;
logic  dec_pciephy_ctrl_560;
PCIEPHY_CTRL_560_t reg_pciephy_ctrl_560;
logic  pciephy_ctrl_560_we;
logic  dec_pciephy_ctrl_561;
PCIEPHY_CTRL_561_t reg_pciephy_ctrl_561;
logic  pciephy_ctrl_561_we;
logic  dec_pciephy_ctrl_562;
PCIEPHY_CTRL_562_t reg_pciephy_ctrl_562;
logic  pciephy_ctrl_562_we;
logic  dec_pciephy_ctrl_563;
PCIEPHY_CTRL_563_t reg_pciephy_ctrl_563;
logic  pciephy_ctrl_563_we;
logic  dec_pciephy_ctrl_564;
PCIEPHY_CTRL_564_t reg_pciephy_ctrl_564;
logic  pciephy_ctrl_564_we;
logic  dec_pciephy_ctrl_565;
PCIEPHY_CTRL_565_t reg_pciephy_ctrl_565;
logic  dec_pciephy_ctrl_566;
PCIEPHY_CTRL_566_t reg_pciephy_ctrl_566;
logic  dec_pciephy_ctrl_567;
PCIEPHY_CTRL_567_t reg_pciephy_ctrl_567;
logic  dec_pciephy_ctrl_568;
PCIEPHY_CTRL_568_t reg_pciephy_ctrl_568;
logic  dec_pciephy_ctrl_569;
PCIEPHY_CTRL_569_t reg_pciephy_ctrl_569;
logic  dec_pciephy_ctrl_570;
PCIEPHY_CTRL_570_t reg_pciephy_ctrl_570;
logic  dec_pciephy_ctrl_571;
PCIEPHY_CTRL_571_t reg_pciephy_ctrl_571;
logic  dec_pciephy_ctrl_572;
PCIEPHY_CTRL_572_t reg_pciephy_ctrl_572;
logic  dec_pciephy_ctrl_573;
PCIEPHY_CTRL_573_t reg_pciephy_ctrl_573;
logic  dec_pciephy_ctrl_574;
PCIEPHY_CTRL_574_t reg_pciephy_ctrl_574;
logic  dec_pciephy_ctrl_575;
PCIEPHY_CTRL_575_t reg_pciephy_ctrl_575;
logic  dec_pciephy_ctrl_576;
PCIEPHY_CTRL_576_t reg_pciephy_ctrl_576;
logic  dec_pciephy_ctrl_577;
PCIEPHY_CTRL_577_t reg_pciephy_ctrl_577;
logic  dec_pciephy_ctrl_578;
PCIEPHY_CTRL_578_t reg_pciephy_ctrl_578;
logic  dec_pciephy_ctrl_579;
PCIEPHY_CTRL_579_t reg_pciephy_ctrl_579;
logic  dec_pciephy_ctrl_580;
PCIEPHY_CTRL_580_t reg_pciephy_ctrl_580;
logic  dec_pciephy_ctrl_581;
PCIEPHY_CTRL_581_t reg_pciephy_ctrl_581;
logic  dec_pciephy_ctrl_582;
PCIEPHY_CTRL_582_t reg_pciephy_ctrl_582;
logic  dec_pciephy_ctrl_583;
PCIEPHY_CTRL_583_t reg_pciephy_ctrl_583;
logic  dec_pciephy_ctrl_584;
PCIEPHY_CTRL_584_t reg_pciephy_ctrl_584;
logic  dec_pciephy_ctrl_585;
PCIEPHY_CTRL_585_t reg_pciephy_ctrl_585;
logic  dec_pciephy_ctrl_586;
PCIEPHY_CTRL_586_t reg_pciephy_ctrl_586;
logic  dec_pciephy_ctrl_587;
PCIEPHY_CTRL_587_t reg_pciephy_ctrl_587;
logic  dec_pciephy_ctrl_588;
PCIEPHY_CTRL_588_t reg_pciephy_ctrl_588;
logic  dec_pciephy_ctrl_589;
PCIEPHY_CTRL_589_t reg_pciephy_ctrl_589;

// apb interface
assign prdata = reg_rdata;
assign reg_wr = psel && penable && pwrite;
assign reg_rd = psel && !penable && !pwrite;
assign pready = 1'b1;
assign slverr = psel && !in_range;
assign reg_addr = paddr;
assign reg_wdata = pwdata;
assign dec_pciephy_ctrl_0 = (reg_addr == 12'h000) ? 1'd1 : 1'd0;
assign pciephy_ctrl_0_we = reg_wr && dec_pciephy_ctrl_0;
// non-RO: output
assign cfg_pciephy_ctrl_0 = reg_pciephy_ctrl_0;
assign dec_pciephy_ctrl_1 = (reg_addr == 12'h004) ? 1'd1 : 1'd0;
assign pciephy_ctrl_1_we = reg_wr && dec_pciephy_ctrl_1;
// non-RO: output
assign cfg_pciephy_ctrl_1 = reg_pciephy_ctrl_1;
assign dec_pciephy_ctrl_2 = (reg_addr == 12'h008) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_2 = cfg_pciephy_ctrl_2;
assign dec_pciephy_ctrl_3 = (reg_addr == 12'h00C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_3_we = reg_wr && dec_pciephy_ctrl_3;
// non-RO: output
assign cfg_pciephy_ctrl_3 = reg_pciephy_ctrl_3;
assign dec_pciephy_ctrl_4 = (reg_addr == 12'h010) ? 1'd1 : 1'd0;
assign pciephy_ctrl_4_we = reg_wr && dec_pciephy_ctrl_4;
// non-RO: output
assign cfg_pciephy_ctrl_4 = reg_pciephy_ctrl_4;
assign dec_pciephy_ctrl_5 = (reg_addr == 12'h014) ? 1'd1 : 1'd0;
assign pciephy_ctrl_5_we = reg_wr && dec_pciephy_ctrl_5;
// non-RO: output
assign cfg_pciephy_ctrl_5 = reg_pciephy_ctrl_5;
assign dec_pciephy_ctrl_6 = (reg_addr == 12'h018) ? 1'd1 : 1'd0;
assign pciephy_ctrl_6_we = reg_wr && dec_pciephy_ctrl_6;
// non-RO: output
assign cfg_pciephy_ctrl_6 = reg_pciephy_ctrl_6;
assign dec_pciephy_ctrl_7 = (reg_addr == 12'h01C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_7_we = reg_wr && dec_pciephy_ctrl_7;
// non-RO: output
assign cfg_pciephy_ctrl_7 = reg_pciephy_ctrl_7;
assign dec_pciephy_ctrl_8 = (reg_addr == 12'h020) ? 1'd1 : 1'd0;
assign pciephy_ctrl_8_we = reg_wr && dec_pciephy_ctrl_8;
// non-RO: output
assign cfg_pciephy_ctrl_8 = reg_pciephy_ctrl_8;
assign dec_pciephy_ctrl_9 = (reg_addr == 12'h024) ? 1'd1 : 1'd0;
assign pciephy_ctrl_9_we = reg_wr && dec_pciephy_ctrl_9;
// non-RO: output
assign cfg_pciephy_ctrl_9 = reg_pciephy_ctrl_9;
assign dec_pciephy_ctrl_10 = (reg_addr == 12'h028) ? 1'd1 : 1'd0;
assign pciephy_ctrl_10_we = reg_wr && dec_pciephy_ctrl_10;
// non-RO: output
assign cfg_pciephy_ctrl_10 = reg_pciephy_ctrl_10;
assign dec_pciephy_ctrl_11 = (reg_addr == 12'h02C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_11_we = reg_wr && dec_pciephy_ctrl_11;
// non-RO: output
assign cfg_pciephy_ctrl_11 = reg_pciephy_ctrl_11;
assign dec_pciephy_ctrl_12 = (reg_addr == 12'h030) ? 1'd1 : 1'd0;
assign pciephy_ctrl_12_we = reg_wr && dec_pciephy_ctrl_12;
// non-RO: output
assign cfg_pciephy_ctrl_12 = reg_pciephy_ctrl_12;
assign dec_pciephy_ctrl_13 = (reg_addr == 12'h034) ? 1'd1 : 1'd0;
assign pciephy_ctrl_13_we = reg_wr && dec_pciephy_ctrl_13;
// non-RO: output
assign cfg_pciephy_ctrl_13 = reg_pciephy_ctrl_13;
assign dec_pciephy_ctrl_14 = (reg_addr == 12'h038) ? 1'd1 : 1'd0;
assign pciephy_ctrl_14_we = reg_wr && dec_pciephy_ctrl_14;
// non-RO: output
assign cfg_pciephy_ctrl_14 = reg_pciephy_ctrl_14;
assign dec_pciephy_ctrl_15 = (reg_addr == 12'h03C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_15_we = reg_wr && dec_pciephy_ctrl_15;
// non-RO: output
assign cfg_pciephy_ctrl_15 = reg_pciephy_ctrl_15;
assign dec_pciephy_ctrl_16 = (reg_addr == 12'h040) ? 1'd1 : 1'd0;
assign pciephy_ctrl_16_we = reg_wr && dec_pciephy_ctrl_16;
// non-RO: output
assign cfg_pciephy_ctrl_16 = reg_pciephy_ctrl_16;
assign dec_pciephy_ctrl_17 = (reg_addr == 12'h044) ? 1'd1 : 1'd0;
assign pciephy_ctrl_17_we = reg_wr && dec_pciephy_ctrl_17;
// non-RO: output
assign cfg_pciephy_ctrl_17 = reg_pciephy_ctrl_17;
assign dec_pciephy_ctrl_18 = (reg_addr == 12'h048) ? 1'd1 : 1'd0;
assign pciephy_ctrl_18_we = reg_wr && dec_pciephy_ctrl_18;
// non-RO: output
assign cfg_pciephy_ctrl_18 = reg_pciephy_ctrl_18;
assign dec_pciephy_ctrl_19 = (reg_addr == 12'h04C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_19_we = reg_wr && dec_pciephy_ctrl_19;
// non-RO: output
assign cfg_pciephy_ctrl_19 = reg_pciephy_ctrl_19;
assign dec_pciephy_ctrl_20 = (reg_addr == 12'h050) ? 1'd1 : 1'd0;
assign pciephy_ctrl_20_we = reg_wr && dec_pciephy_ctrl_20;
// non-RO: output
assign cfg_pciephy_ctrl_20 = reg_pciephy_ctrl_20;
assign dec_pciephy_ctrl_21 = (reg_addr == 12'h054) ? 1'd1 : 1'd0;
assign pciephy_ctrl_21_we = reg_wr && dec_pciephy_ctrl_21;
// non-RO: output
assign cfg_pciephy_ctrl_21 = reg_pciephy_ctrl_21;
assign dec_pciephy_ctrl_22 = (reg_addr == 12'h058) ? 1'd1 : 1'd0;
assign pciephy_ctrl_22_we = reg_wr && dec_pciephy_ctrl_22;
// non-RO: output
assign cfg_pciephy_ctrl_22 = reg_pciephy_ctrl_22;
assign dec_pciephy_ctrl_23 = (reg_addr == 12'h05C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_23_we = reg_wr && dec_pciephy_ctrl_23;
// non-RO: output
assign cfg_pciephy_ctrl_23 = reg_pciephy_ctrl_23;
assign dec_pciephy_ctrl_24 = (reg_addr == 12'h060) ? 1'd1 : 1'd0;
assign pciephy_ctrl_24_we = reg_wr && dec_pciephy_ctrl_24;
// non-RO: output
assign cfg_pciephy_ctrl_24 = reg_pciephy_ctrl_24;
assign dec_pciephy_ctrl_25 = (reg_addr == 12'h064) ? 1'd1 : 1'd0;
assign pciephy_ctrl_25_we = reg_wr && dec_pciephy_ctrl_25;
// non-RO: output
assign cfg_pciephy_ctrl_25 = reg_pciephy_ctrl_25;
assign dec_pciephy_ctrl_26 = (reg_addr == 12'h068) ? 1'd1 : 1'd0;
assign pciephy_ctrl_26_we = reg_wr && dec_pciephy_ctrl_26;
// non-RO: output
assign cfg_pciephy_ctrl_26 = reg_pciephy_ctrl_26;
assign dec_pciephy_ctrl_27 = (reg_addr == 12'h06C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_27_we = reg_wr && dec_pciephy_ctrl_27;
// non-RO: output
assign cfg_pciephy_ctrl_27 = reg_pciephy_ctrl_27;
assign dec_pciephy_ctrl_28 = (reg_addr == 12'h070) ? 1'd1 : 1'd0;
assign pciephy_ctrl_28_we = reg_wr && dec_pciephy_ctrl_28;
// non-RO: output
assign cfg_pciephy_ctrl_28 = reg_pciephy_ctrl_28;
assign dec_pciephy_ctrl_29 = (reg_addr == 12'h074) ? 1'd1 : 1'd0;
assign pciephy_ctrl_29_we = reg_wr && dec_pciephy_ctrl_29;
// non-RO: output
assign cfg_pciephy_ctrl_29 = reg_pciephy_ctrl_29;
assign dec_pciephy_ctrl_30 = (reg_addr == 12'h078) ? 1'd1 : 1'd0;
assign pciephy_ctrl_30_we = reg_wr && dec_pciephy_ctrl_30;
// non-RO: output
assign cfg_pciephy_ctrl_30 = reg_pciephy_ctrl_30;
assign dec_pciephy_ctrl_31 = (reg_addr == 12'h07C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_31_we = reg_wr && dec_pciephy_ctrl_31;
// non-RO: output
assign cfg_pciephy_ctrl_31 = reg_pciephy_ctrl_31;
assign dec_pciephy_ctrl_32 = (reg_addr == 12'h080) ? 1'd1 : 1'd0;
assign pciephy_ctrl_32_we = reg_wr && dec_pciephy_ctrl_32;
// non-RO: output
assign cfg_pciephy_ctrl_32 = reg_pciephy_ctrl_32;
assign dec_pciephy_ctrl_33 = (reg_addr == 12'h084) ? 1'd1 : 1'd0;
assign pciephy_ctrl_33_we = reg_wr && dec_pciephy_ctrl_33;
// non-RO: output
assign cfg_pciephy_ctrl_33 = reg_pciephy_ctrl_33;
assign dec_pciephy_ctrl_34 = (reg_addr == 12'h088) ? 1'd1 : 1'd0;
assign pciephy_ctrl_34_we = reg_wr && dec_pciephy_ctrl_34;
// non-RO: output
assign cfg_pciephy_ctrl_34 = reg_pciephy_ctrl_34;
assign dec_pciephy_ctrl_35 = (reg_addr == 12'h08C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_35_we = reg_wr && dec_pciephy_ctrl_35;
// non-RO: output
assign cfg_pciephy_ctrl_35 = reg_pciephy_ctrl_35;
assign dec_pciephy_ctrl_36 = (reg_addr == 12'h090) ? 1'd1 : 1'd0;
assign pciephy_ctrl_36_we = reg_wr && dec_pciephy_ctrl_36;
// non-RO: output
assign cfg_pciephy_ctrl_36 = reg_pciephy_ctrl_36;
assign dec_pciephy_ctrl_37 = (reg_addr == 12'h094) ? 1'd1 : 1'd0;
assign pciephy_ctrl_37_we = reg_wr && dec_pciephy_ctrl_37;
// non-RO: output
assign cfg_pciephy_ctrl_37 = reg_pciephy_ctrl_37;
assign dec_pciephy_ctrl_38 = (reg_addr == 12'h098) ? 1'd1 : 1'd0;
assign pciephy_ctrl_38_we = reg_wr && dec_pciephy_ctrl_38;
// non-RO: output
assign cfg_pciephy_ctrl_38 = reg_pciephy_ctrl_38;
assign dec_pciephy_ctrl_39 = (reg_addr == 12'h09C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_39_we = reg_wr && dec_pciephy_ctrl_39;
// non-RO: output
assign cfg_pciephy_ctrl_39 = reg_pciephy_ctrl_39;
assign dec_pciephy_ctrl_40 = (reg_addr == 12'h0A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_40_we = reg_wr && dec_pciephy_ctrl_40;
// non-RO: output
assign cfg_pciephy_ctrl_40 = reg_pciephy_ctrl_40;
assign dec_pciephy_ctrl_41 = (reg_addr == 12'h0A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_41_we = reg_wr && dec_pciephy_ctrl_41;
// non-RO: output
assign cfg_pciephy_ctrl_41 = reg_pciephy_ctrl_41;
assign dec_pciephy_ctrl_42 = (reg_addr == 12'h0A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_42_we = reg_wr && dec_pciephy_ctrl_42;
// non-RO: output
assign cfg_pciephy_ctrl_42 = reg_pciephy_ctrl_42;
assign dec_pciephy_ctrl_43 = (reg_addr == 12'h0AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_43_we = reg_wr && dec_pciephy_ctrl_43;
// non-RO: output
assign cfg_pciephy_ctrl_43 = reg_pciephy_ctrl_43;
assign dec_pciephy_ctrl_44 = (reg_addr == 12'h0B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_44_we = reg_wr && dec_pciephy_ctrl_44;
// non-RO: output
assign cfg_pciephy_ctrl_44 = reg_pciephy_ctrl_44;
assign dec_pciephy_ctrl_45 = (reg_addr == 12'h0B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_45_we = reg_wr && dec_pciephy_ctrl_45;
// non-RO: output
assign cfg_pciephy_ctrl_45 = reg_pciephy_ctrl_45;
assign dec_pciephy_ctrl_46 = (reg_addr == 12'h0B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_46_we = reg_wr && dec_pciephy_ctrl_46;
// non-RO: output
assign cfg_pciephy_ctrl_46 = reg_pciephy_ctrl_46;
assign dec_pciephy_ctrl_47 = (reg_addr == 12'h0BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_47_we = reg_wr && dec_pciephy_ctrl_47;
// non-RO: output
assign cfg_pciephy_ctrl_47 = reg_pciephy_ctrl_47;
assign dec_pciephy_ctrl_48 = (reg_addr == 12'h0C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_48_we = reg_wr && dec_pciephy_ctrl_48;
// non-RO: output
assign cfg_pciephy_ctrl_48 = reg_pciephy_ctrl_48;
assign dec_pciephy_ctrl_49 = (reg_addr == 12'h0C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_49_we = reg_wr && dec_pciephy_ctrl_49;
// non-RO: output
assign cfg_pciephy_ctrl_49 = reg_pciephy_ctrl_49;
assign dec_pciephy_ctrl_50 = (reg_addr == 12'h0C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_50_we = reg_wr && dec_pciephy_ctrl_50;
// non-RO: output
assign cfg_pciephy_ctrl_50 = reg_pciephy_ctrl_50;
assign dec_pciephy_ctrl_51 = (reg_addr == 12'h0CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_51_we = reg_wr && dec_pciephy_ctrl_51;
// non-RO: output
assign cfg_pciephy_ctrl_51 = reg_pciephy_ctrl_51;
assign dec_pciephy_ctrl_52 = (reg_addr == 12'h0D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_52_we = reg_wr && dec_pciephy_ctrl_52;
// non-RO: output
assign cfg_pciephy_ctrl_52 = reg_pciephy_ctrl_52;
assign dec_pciephy_ctrl_53 = (reg_addr == 12'h0D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_53_we = reg_wr && dec_pciephy_ctrl_53;
// non-RO: output
assign cfg_pciephy_ctrl_53 = reg_pciephy_ctrl_53;
assign dec_pciephy_ctrl_54 = (reg_addr == 12'h0D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_54_we = reg_wr && dec_pciephy_ctrl_54;
// non-RO: output
assign cfg_pciephy_ctrl_54 = reg_pciephy_ctrl_54;
assign dec_pciephy_ctrl_55 = (reg_addr == 12'h0DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_55_we = reg_wr && dec_pciephy_ctrl_55;
// non-RO: output
assign cfg_pciephy_ctrl_55 = reg_pciephy_ctrl_55;
assign dec_pciephy_ctrl_56 = (reg_addr == 12'h0E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_56_we = reg_wr && dec_pciephy_ctrl_56;
// non-RO: output
assign cfg_pciephy_ctrl_56 = reg_pciephy_ctrl_56;
assign dec_pciephy_ctrl_57 = (reg_addr == 12'h0E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_57_we = reg_wr && dec_pciephy_ctrl_57;
// non-RO: output
assign cfg_pciephy_ctrl_57 = reg_pciephy_ctrl_57;
assign dec_pciephy_ctrl_58 = (reg_addr == 12'h0E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_58_we = reg_wr && dec_pciephy_ctrl_58;
// non-RO: output
assign cfg_pciephy_ctrl_58 = reg_pciephy_ctrl_58;
assign dec_pciephy_ctrl_59 = (reg_addr == 12'h0EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_59_we = reg_wr && dec_pciephy_ctrl_59;
// non-RO: output
assign cfg_pciephy_ctrl_59 = reg_pciephy_ctrl_59;
assign dec_pciephy_ctrl_60 = (reg_addr == 12'h0F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_60_we = reg_wr && dec_pciephy_ctrl_60;
// non-RO: output
assign cfg_pciephy_ctrl_60 = reg_pciephy_ctrl_60;
assign dec_pciephy_ctrl_61 = (reg_addr == 12'h0F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_61_we = reg_wr && dec_pciephy_ctrl_61;
// non-RO: output
assign cfg_pciephy_ctrl_61 = reg_pciephy_ctrl_61;
assign dec_pciephy_ctrl_62 = (reg_addr == 12'h0F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_62_we = reg_wr && dec_pciephy_ctrl_62;
// non-RO: output
assign cfg_pciephy_ctrl_62 = reg_pciephy_ctrl_62;
assign dec_pciephy_ctrl_63 = (reg_addr == 12'h0FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_63_we = reg_wr && dec_pciephy_ctrl_63;
// non-RO: output
assign cfg_pciephy_ctrl_63 = reg_pciephy_ctrl_63;
assign dec_pciephy_ctrl_64 = (reg_addr == 12'h100) ? 1'd1 : 1'd0;
assign pciephy_ctrl_64_we = reg_wr && dec_pciephy_ctrl_64;
// non-RO: output
assign cfg_pciephy_ctrl_64 = reg_pciephy_ctrl_64;
assign dec_pciephy_ctrl_65 = (reg_addr == 12'h104) ? 1'd1 : 1'd0;
assign pciephy_ctrl_65_we = reg_wr && dec_pciephy_ctrl_65;
// non-RO: output
assign cfg_pciephy_ctrl_65 = reg_pciephy_ctrl_65;
assign dec_pciephy_ctrl_66 = (reg_addr == 12'h108) ? 1'd1 : 1'd0;
assign pciephy_ctrl_66_we = reg_wr && dec_pciephy_ctrl_66;
// non-RO: output
assign cfg_pciephy_ctrl_66 = reg_pciephy_ctrl_66;
assign dec_pciephy_ctrl_67 = (reg_addr == 12'h10C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_67_we = reg_wr && dec_pciephy_ctrl_67;
// non-RO: output
assign cfg_pciephy_ctrl_67 = reg_pciephy_ctrl_67;
assign dec_pciephy_ctrl_68 = (reg_addr == 12'h110) ? 1'd1 : 1'd0;
assign pciephy_ctrl_68_we = reg_wr && dec_pciephy_ctrl_68;
// non-RO: output
assign cfg_pciephy_ctrl_68 = reg_pciephy_ctrl_68;
assign dec_pciephy_ctrl_69 = (reg_addr == 12'h114) ? 1'd1 : 1'd0;
assign pciephy_ctrl_69_we = reg_wr && dec_pciephy_ctrl_69;
// non-RO: output
assign cfg_pciephy_ctrl_69 = reg_pciephy_ctrl_69;
assign dec_pciephy_ctrl_70 = (reg_addr == 12'h118) ? 1'd1 : 1'd0;
assign pciephy_ctrl_70_we = reg_wr && dec_pciephy_ctrl_70;
// non-RO: output
assign cfg_pciephy_ctrl_70 = reg_pciephy_ctrl_70;
assign dec_pciephy_ctrl_71 = (reg_addr == 12'h11C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_71_we = reg_wr && dec_pciephy_ctrl_71;
// non-RO: output
assign cfg_pciephy_ctrl_71 = reg_pciephy_ctrl_71;
assign dec_pciephy_ctrl_72 = (reg_addr == 12'h120) ? 1'd1 : 1'd0;
assign pciephy_ctrl_72_we = reg_wr && dec_pciephy_ctrl_72;
// non-RO: output
assign cfg_pciephy_ctrl_72 = reg_pciephy_ctrl_72;
assign dec_pciephy_ctrl_73 = (reg_addr == 12'h124) ? 1'd1 : 1'd0;
assign pciephy_ctrl_73_we = reg_wr && dec_pciephy_ctrl_73;
// non-RO: output
assign cfg_pciephy_ctrl_73 = reg_pciephy_ctrl_73;
assign dec_pciephy_ctrl_74 = (reg_addr == 12'h128) ? 1'd1 : 1'd0;
assign pciephy_ctrl_74_we = reg_wr && dec_pciephy_ctrl_74;
// non-RO: output
assign cfg_pciephy_ctrl_74 = reg_pciephy_ctrl_74;
assign dec_pciephy_ctrl_75 = (reg_addr == 12'h12C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_75_we = reg_wr && dec_pciephy_ctrl_75;
// non-RO: output
assign cfg_pciephy_ctrl_75 = reg_pciephy_ctrl_75;
assign dec_pciephy_ctrl_76 = (reg_addr == 12'h130) ? 1'd1 : 1'd0;
assign pciephy_ctrl_76_we = reg_wr && dec_pciephy_ctrl_76;
// non-RO: output
assign cfg_pciephy_ctrl_76 = reg_pciephy_ctrl_76;
assign dec_pciephy_ctrl_77 = (reg_addr == 12'h134) ? 1'd1 : 1'd0;
assign pciephy_ctrl_77_we = reg_wr && dec_pciephy_ctrl_77;
// non-RO: output
assign cfg_pciephy_ctrl_77 = reg_pciephy_ctrl_77;
assign dec_pciephy_ctrl_78 = (reg_addr == 12'h138) ? 1'd1 : 1'd0;
assign pciephy_ctrl_78_we = reg_wr && dec_pciephy_ctrl_78;
// non-RO: output
assign cfg_pciephy_ctrl_78 = reg_pciephy_ctrl_78;
assign dec_pciephy_ctrl_79 = (reg_addr == 12'h13C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_79_we = reg_wr && dec_pciephy_ctrl_79;
// non-RO: output
assign cfg_pciephy_ctrl_79 = reg_pciephy_ctrl_79;
assign dec_pciephy_ctrl_80 = (reg_addr == 12'h140) ? 1'd1 : 1'd0;
assign pciephy_ctrl_80_we = reg_wr && dec_pciephy_ctrl_80;
// non-RO: output
assign cfg_pciephy_ctrl_80 = reg_pciephy_ctrl_80;
assign dec_pciephy_ctrl_81 = (reg_addr == 12'h144) ? 1'd1 : 1'd0;
assign pciephy_ctrl_81_we = reg_wr && dec_pciephy_ctrl_81;
// non-RO: output
assign cfg_pciephy_ctrl_81 = reg_pciephy_ctrl_81;
assign dec_pciephy_ctrl_82 = (reg_addr == 12'h148) ? 1'd1 : 1'd0;
assign pciephy_ctrl_82_we = reg_wr && dec_pciephy_ctrl_82;
// non-RO: output
assign cfg_pciephy_ctrl_82 = reg_pciephy_ctrl_82;
assign dec_pciephy_ctrl_83 = (reg_addr == 12'h14C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_83_we = reg_wr && dec_pciephy_ctrl_83;
// non-RO: output
assign cfg_pciephy_ctrl_83 = reg_pciephy_ctrl_83;
assign dec_pciephy_ctrl_84 = (reg_addr == 12'h150) ? 1'd1 : 1'd0;
assign pciephy_ctrl_84_we = reg_wr && dec_pciephy_ctrl_84;
// non-RO: output
assign cfg_pciephy_ctrl_84 = reg_pciephy_ctrl_84;
assign dec_pciephy_ctrl_85 = (reg_addr == 12'h154) ? 1'd1 : 1'd0;
assign pciephy_ctrl_85_we = reg_wr && dec_pciephy_ctrl_85;
// non-RO: output
assign cfg_pciephy_ctrl_85 = reg_pciephy_ctrl_85;
assign dec_pciephy_ctrl_86 = (reg_addr == 12'h158) ? 1'd1 : 1'd0;
assign pciephy_ctrl_86_we = reg_wr && dec_pciephy_ctrl_86;
// non-RO: output
assign cfg_pciephy_ctrl_86 = reg_pciephy_ctrl_86;
assign dec_pciephy_ctrl_87 = (reg_addr == 12'h15C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_87_we = reg_wr && dec_pciephy_ctrl_87;
// non-RO: output
assign cfg_pciephy_ctrl_87 = reg_pciephy_ctrl_87;
assign dec_pciephy_ctrl_88 = (reg_addr == 12'h160) ? 1'd1 : 1'd0;
assign pciephy_ctrl_88_we = reg_wr && dec_pciephy_ctrl_88;
// non-RO: output
assign cfg_pciephy_ctrl_88 = reg_pciephy_ctrl_88;
assign dec_pciephy_ctrl_89 = (reg_addr == 12'h164) ? 1'd1 : 1'd0;
assign pciephy_ctrl_89_we = reg_wr && dec_pciephy_ctrl_89;
// non-RO: output
assign cfg_pciephy_ctrl_89 = reg_pciephy_ctrl_89;
assign dec_pciephy_ctrl_90 = (reg_addr == 12'h168) ? 1'd1 : 1'd0;
assign pciephy_ctrl_90_we = reg_wr && dec_pciephy_ctrl_90;
// non-RO: output
assign cfg_pciephy_ctrl_90 = reg_pciephy_ctrl_90;
assign dec_pciephy_ctrl_91 = (reg_addr == 12'h16C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_91_we = reg_wr && dec_pciephy_ctrl_91;
// non-RO: output
assign cfg_pciephy_ctrl_91 = reg_pciephy_ctrl_91;
assign dec_pciephy_ctrl_92 = (reg_addr == 12'h170) ? 1'd1 : 1'd0;
assign pciephy_ctrl_92_we = reg_wr && dec_pciephy_ctrl_92;
// non-RO: output
assign cfg_pciephy_ctrl_92 = reg_pciephy_ctrl_92;
assign dec_pciephy_ctrl_93 = (reg_addr == 12'h174) ? 1'd1 : 1'd0;
assign pciephy_ctrl_93_we = reg_wr && dec_pciephy_ctrl_93;
// non-RO: output
assign cfg_pciephy_ctrl_93 = reg_pciephy_ctrl_93;
assign dec_pciephy_ctrl_94 = (reg_addr == 12'h178) ? 1'd1 : 1'd0;
assign pciephy_ctrl_94_we = reg_wr && dec_pciephy_ctrl_94;
// non-RO: output
assign cfg_pciephy_ctrl_94 = reg_pciephy_ctrl_94;
assign dec_pciephy_ctrl_95 = (reg_addr == 12'h17C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_95_we = reg_wr && dec_pciephy_ctrl_95;
// non-RO: output
assign cfg_pciephy_ctrl_95 = reg_pciephy_ctrl_95;
assign dec_pciephy_ctrl_96 = (reg_addr == 12'h180) ? 1'd1 : 1'd0;
assign pciephy_ctrl_96_we = reg_wr && dec_pciephy_ctrl_96;
// non-RO: output
assign cfg_pciephy_ctrl_96 = reg_pciephy_ctrl_96;
assign dec_pciephy_ctrl_97 = (reg_addr == 12'h184) ? 1'd1 : 1'd0;
assign pciephy_ctrl_97_we = reg_wr && dec_pciephy_ctrl_97;
// non-RO: output
assign cfg_pciephy_ctrl_97 = reg_pciephy_ctrl_97;
assign dec_pciephy_ctrl_98 = (reg_addr == 12'h188) ? 1'd1 : 1'd0;
assign pciephy_ctrl_98_we = reg_wr && dec_pciephy_ctrl_98;
// non-RO: output
assign cfg_pciephy_ctrl_98 = reg_pciephy_ctrl_98;
assign dec_pciephy_ctrl_99 = (reg_addr == 12'h18C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_99_we = reg_wr && dec_pciephy_ctrl_99;
// non-RO: output
assign cfg_pciephy_ctrl_99 = reg_pciephy_ctrl_99;
assign dec_pciephy_ctrl_100 = (reg_addr == 12'h190) ? 1'd1 : 1'd0;
assign pciephy_ctrl_100_we = reg_wr && dec_pciephy_ctrl_100;
// non-RO: output
assign cfg_pciephy_ctrl_100 = reg_pciephy_ctrl_100;
assign dec_pciephy_ctrl_101 = (reg_addr == 12'h194) ? 1'd1 : 1'd0;
assign pciephy_ctrl_101_we = reg_wr && dec_pciephy_ctrl_101;
// non-RO: output
assign cfg_pciephy_ctrl_101 = reg_pciephy_ctrl_101;
assign dec_pciephy_ctrl_102 = (reg_addr == 12'h198) ? 1'd1 : 1'd0;
assign pciephy_ctrl_102_we = reg_wr && dec_pciephy_ctrl_102;
// non-RO: output
assign cfg_pciephy_ctrl_102 = reg_pciephy_ctrl_102;
assign dec_pciephy_ctrl_103 = (reg_addr == 12'h19C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_103_we = reg_wr && dec_pciephy_ctrl_103;
// non-RO: output
assign cfg_pciephy_ctrl_103 = reg_pciephy_ctrl_103;
assign dec_pciephy_ctrl_104 = (reg_addr == 12'h1A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_104_we = reg_wr && dec_pciephy_ctrl_104;
// non-RO: output
assign cfg_pciephy_ctrl_104 = reg_pciephy_ctrl_104;
assign dec_pciephy_ctrl_105 = (reg_addr == 12'h1A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_105_we = reg_wr && dec_pciephy_ctrl_105;
// non-RO: output
assign cfg_pciephy_ctrl_105 = reg_pciephy_ctrl_105;
assign dec_pciephy_ctrl_106 = (reg_addr == 12'h1A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_106_we = reg_wr && dec_pciephy_ctrl_106;
// non-RO: output
assign cfg_pciephy_ctrl_106 = reg_pciephy_ctrl_106;
assign dec_pciephy_ctrl_107 = (reg_addr == 12'h1AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_107_we = reg_wr && dec_pciephy_ctrl_107;
// non-RO: output
assign cfg_pciephy_ctrl_107 = reg_pciephy_ctrl_107;
assign dec_pciephy_ctrl_108 = (reg_addr == 12'h1B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_108_we = reg_wr && dec_pciephy_ctrl_108;
// non-RO: output
assign cfg_pciephy_ctrl_108 = reg_pciephy_ctrl_108;
assign dec_pciephy_ctrl_109 = (reg_addr == 12'h1B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_109_we = reg_wr && dec_pciephy_ctrl_109;
// non-RO: output
assign cfg_pciephy_ctrl_109 = reg_pciephy_ctrl_109;
assign dec_pciephy_ctrl_110 = (reg_addr == 12'h1B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_110_we = reg_wr && dec_pciephy_ctrl_110;
// non-RO: output
assign cfg_pciephy_ctrl_110 = reg_pciephy_ctrl_110;
assign dec_pciephy_ctrl_111 = (reg_addr == 12'h1BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_111_we = reg_wr && dec_pciephy_ctrl_111;
// non-RO: output
assign cfg_pciephy_ctrl_111 = reg_pciephy_ctrl_111;
assign dec_pciephy_ctrl_112 = (reg_addr == 12'h1C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_112_we = reg_wr && dec_pciephy_ctrl_112;
// non-RO: output
assign cfg_pciephy_ctrl_112 = reg_pciephy_ctrl_112;
assign dec_pciephy_ctrl_113 = (reg_addr == 12'h1C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_113_we = reg_wr && dec_pciephy_ctrl_113;
// non-RO: output
assign cfg_pciephy_ctrl_113 = reg_pciephy_ctrl_113;
assign dec_pciephy_ctrl_114 = (reg_addr == 12'h1C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_114_we = reg_wr && dec_pciephy_ctrl_114;
// non-RO: output
assign cfg_pciephy_ctrl_114 = reg_pciephy_ctrl_114;
assign dec_pciephy_ctrl_115 = (reg_addr == 12'h1CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_115_we = reg_wr && dec_pciephy_ctrl_115;
// non-RO: output
assign cfg_pciephy_ctrl_115 = reg_pciephy_ctrl_115;
assign dec_pciephy_ctrl_116 = (reg_addr == 12'h1D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_116_we = reg_wr && dec_pciephy_ctrl_116;
// non-RO: output
assign cfg_pciephy_ctrl_116 = reg_pciephy_ctrl_116;
assign dec_pciephy_ctrl_117 = (reg_addr == 12'h1D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_117_we = reg_wr && dec_pciephy_ctrl_117;
// non-RO: output
assign cfg_pciephy_ctrl_117 = reg_pciephy_ctrl_117;
assign dec_pciephy_ctrl_118 = (reg_addr == 12'h1D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_118_we = reg_wr && dec_pciephy_ctrl_118;
// non-RO: output
assign cfg_pciephy_ctrl_118 = reg_pciephy_ctrl_118;
assign dec_pciephy_ctrl_119 = (reg_addr == 12'h1DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_119_we = reg_wr && dec_pciephy_ctrl_119;
// non-RO: output
assign cfg_pciephy_ctrl_119 = reg_pciephy_ctrl_119;
assign dec_pciephy_ctrl_120 = (reg_addr == 12'h1E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_120_we = reg_wr && dec_pciephy_ctrl_120;
// non-RO: output
assign cfg_pciephy_ctrl_120 = reg_pciephy_ctrl_120;
assign dec_pciephy_ctrl_121 = (reg_addr == 12'h1E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_121_we = reg_wr && dec_pciephy_ctrl_121;
// non-RO: output
assign cfg_pciephy_ctrl_121 = reg_pciephy_ctrl_121;
assign dec_pciephy_ctrl_122 = (reg_addr == 12'h1E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_122_we = reg_wr && dec_pciephy_ctrl_122;
// non-RO: output
assign cfg_pciephy_ctrl_122 = reg_pciephy_ctrl_122;
assign dec_pciephy_ctrl_123 = (reg_addr == 12'h1EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_123_we = reg_wr && dec_pciephy_ctrl_123;
// non-RO: output
assign cfg_pciephy_ctrl_123 = reg_pciephy_ctrl_123;
assign dec_pciephy_ctrl_124 = (reg_addr == 12'h1F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_124_we = reg_wr && dec_pciephy_ctrl_124;
// non-RO: output
assign cfg_pciephy_ctrl_124 = reg_pciephy_ctrl_124;
assign dec_pciephy_ctrl_125 = (reg_addr == 12'h1F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_125_we = reg_wr && dec_pciephy_ctrl_125;
// non-RO: output
assign cfg_pciephy_ctrl_125 = reg_pciephy_ctrl_125;
assign dec_pciephy_ctrl_126 = (reg_addr == 12'h1F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_126_we = reg_wr && dec_pciephy_ctrl_126;
// non-RO: output
assign cfg_pciephy_ctrl_126 = reg_pciephy_ctrl_126;
assign dec_pciephy_ctrl_127 = (reg_addr == 12'h1FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_127_we = reg_wr && dec_pciephy_ctrl_127;
// non-RO: output
assign cfg_pciephy_ctrl_127 = reg_pciephy_ctrl_127;
assign dec_pciephy_ctrl_128 = (reg_addr == 12'h200) ? 1'd1 : 1'd0;
assign pciephy_ctrl_128_we = reg_wr && dec_pciephy_ctrl_128;
// non-RO: output
assign cfg_pciephy_ctrl_128 = reg_pciephy_ctrl_128;
assign dec_pciephy_ctrl_129 = (reg_addr == 12'h204) ? 1'd1 : 1'd0;
assign pciephy_ctrl_129_we = reg_wr && dec_pciephy_ctrl_129;
// non-RO: output
assign cfg_pciephy_ctrl_129 = reg_pciephy_ctrl_129;
assign dec_pciephy_ctrl_130 = (reg_addr == 12'h208) ? 1'd1 : 1'd0;
assign pciephy_ctrl_130_we = reg_wr && dec_pciephy_ctrl_130;
// non-RO: output
assign cfg_pciephy_ctrl_130 = reg_pciephy_ctrl_130;
assign dec_pciephy_ctrl_131 = (reg_addr == 12'h20C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_131_we = reg_wr && dec_pciephy_ctrl_131;
// non-RO: output
assign cfg_pciephy_ctrl_131 = reg_pciephy_ctrl_131;
assign dec_pciephy_ctrl_132 = (reg_addr == 12'h210) ? 1'd1 : 1'd0;
assign pciephy_ctrl_132_we = reg_wr && dec_pciephy_ctrl_132;
// non-RO: output
assign cfg_pciephy_ctrl_132 = reg_pciephy_ctrl_132;
assign dec_pciephy_ctrl_133 = (reg_addr == 12'h214) ? 1'd1 : 1'd0;
assign pciephy_ctrl_133_we = reg_wr && dec_pciephy_ctrl_133;
// non-RO: output
assign cfg_pciephy_ctrl_133 = reg_pciephy_ctrl_133;
assign dec_pciephy_ctrl_134 = (reg_addr == 12'h218) ? 1'd1 : 1'd0;
assign pciephy_ctrl_134_we = reg_wr && dec_pciephy_ctrl_134;
// non-RO: output
assign cfg_pciephy_ctrl_134 = reg_pciephy_ctrl_134;
assign dec_pciephy_ctrl_135 = (reg_addr == 12'h21C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_135_we = reg_wr && dec_pciephy_ctrl_135;
// non-RO: output
assign cfg_pciephy_ctrl_135 = reg_pciephy_ctrl_135;
assign dec_pciephy_ctrl_136 = (reg_addr == 12'h220) ? 1'd1 : 1'd0;
assign pciephy_ctrl_136_we = reg_wr && dec_pciephy_ctrl_136;
// non-RO: output
assign cfg_pciephy_ctrl_136 = reg_pciephy_ctrl_136;
assign dec_pciephy_ctrl_137 = (reg_addr == 12'h224) ? 1'd1 : 1'd0;
assign pciephy_ctrl_137_we = reg_wr && dec_pciephy_ctrl_137;
// non-RO: output
assign cfg_pciephy_ctrl_137 = reg_pciephy_ctrl_137;
assign dec_pciephy_ctrl_138 = (reg_addr == 12'h228) ? 1'd1 : 1'd0;
assign pciephy_ctrl_138_we = reg_wr && dec_pciephy_ctrl_138;
// non-RO: output
assign cfg_pciephy_ctrl_138 = reg_pciephy_ctrl_138;
assign dec_pciephy_ctrl_139 = (reg_addr == 12'h22C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_139_we = reg_wr && dec_pciephy_ctrl_139;
// non-RO: output
assign cfg_pciephy_ctrl_139 = reg_pciephy_ctrl_139;
assign dec_pciephy_ctrl_140 = (reg_addr == 12'h230) ? 1'd1 : 1'd0;
assign pciephy_ctrl_140_we = reg_wr && dec_pciephy_ctrl_140;
// non-RO: output
assign cfg_pciephy_ctrl_140 = reg_pciephy_ctrl_140;
assign dec_pciephy_ctrl_141 = (reg_addr == 12'h234) ? 1'd1 : 1'd0;
assign pciephy_ctrl_141_we = reg_wr && dec_pciephy_ctrl_141;
// non-RO: output
assign cfg_pciephy_ctrl_141 = reg_pciephy_ctrl_141;
assign dec_pciephy_ctrl_142 = (reg_addr == 12'h238) ? 1'd1 : 1'd0;
assign pciephy_ctrl_142_we = reg_wr && dec_pciephy_ctrl_142;
// non-RO: output
assign cfg_pciephy_ctrl_142 = reg_pciephy_ctrl_142;
assign dec_pciephy_ctrl_143 = (reg_addr == 12'h23C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_143_we = reg_wr && dec_pciephy_ctrl_143;
// non-RO: output
assign cfg_pciephy_ctrl_143 = reg_pciephy_ctrl_143;
assign dec_pciephy_ctrl_144 = (reg_addr == 12'h240) ? 1'd1 : 1'd0;
assign pciephy_ctrl_144_we = reg_wr && dec_pciephy_ctrl_144;
// non-RO: output
assign cfg_pciephy_ctrl_144 = reg_pciephy_ctrl_144;
assign dec_pciephy_ctrl_145 = (reg_addr == 12'h244) ? 1'd1 : 1'd0;
assign pciephy_ctrl_145_we = reg_wr && dec_pciephy_ctrl_145;
// non-RO: output
assign cfg_pciephy_ctrl_145 = reg_pciephy_ctrl_145;
assign dec_pciephy_ctrl_146 = (reg_addr == 12'h248) ? 1'd1 : 1'd0;
assign pciephy_ctrl_146_we = reg_wr && dec_pciephy_ctrl_146;
// non-RO: output
assign cfg_pciephy_ctrl_146 = reg_pciephy_ctrl_146;
assign dec_pciephy_ctrl_147 = (reg_addr == 12'h24C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_147_we = reg_wr && dec_pciephy_ctrl_147;
// non-RO: output
assign cfg_pciephy_ctrl_147 = reg_pciephy_ctrl_147;
assign dec_pciephy_ctrl_148 = (reg_addr == 12'h250) ? 1'd1 : 1'd0;
assign pciephy_ctrl_148_we = reg_wr && dec_pciephy_ctrl_148;
// non-RO: output
assign cfg_pciephy_ctrl_148 = reg_pciephy_ctrl_148;
assign dec_pciephy_ctrl_149 = (reg_addr == 12'h254) ? 1'd1 : 1'd0;
assign pciephy_ctrl_149_we = reg_wr && dec_pciephy_ctrl_149;
// non-RO: output
assign cfg_pciephy_ctrl_149 = reg_pciephy_ctrl_149;
assign dec_pciephy_ctrl_150 = (reg_addr == 12'h258) ? 1'd1 : 1'd0;
assign pciephy_ctrl_150_we = reg_wr && dec_pciephy_ctrl_150;
// non-RO: output
assign cfg_pciephy_ctrl_150 = reg_pciephy_ctrl_150;
assign dec_pciephy_ctrl_151 = (reg_addr == 12'h25C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_151_we = reg_wr && dec_pciephy_ctrl_151;
// non-RO: output
assign cfg_pciephy_ctrl_151 = reg_pciephy_ctrl_151;
assign dec_pciephy_ctrl_152 = (reg_addr == 12'h260) ? 1'd1 : 1'd0;
assign pciephy_ctrl_152_we = reg_wr && dec_pciephy_ctrl_152;
// non-RO: output
assign cfg_pciephy_ctrl_152 = reg_pciephy_ctrl_152;
assign dec_pciephy_ctrl_153 = (reg_addr == 12'h264) ? 1'd1 : 1'd0;
assign pciephy_ctrl_153_we = reg_wr && dec_pciephy_ctrl_153;
// non-RO: output
assign cfg_pciephy_ctrl_153 = reg_pciephy_ctrl_153;
assign dec_pciephy_ctrl_154 = (reg_addr == 12'h268) ? 1'd1 : 1'd0;
assign pciephy_ctrl_154_we = reg_wr && dec_pciephy_ctrl_154;
// non-RO: output
assign cfg_pciephy_ctrl_154 = reg_pciephy_ctrl_154;
assign dec_pciephy_ctrl_155 = (reg_addr == 12'h26C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_155_we = reg_wr && dec_pciephy_ctrl_155;
// non-RO: output
assign cfg_pciephy_ctrl_155 = reg_pciephy_ctrl_155;
assign dec_pciephy_ctrl_156 = (reg_addr == 12'h270) ? 1'd1 : 1'd0;
assign pciephy_ctrl_156_we = reg_wr && dec_pciephy_ctrl_156;
// non-RO: output
assign cfg_pciephy_ctrl_156 = reg_pciephy_ctrl_156;
assign dec_pciephy_ctrl_157 = (reg_addr == 12'h274) ? 1'd1 : 1'd0;
assign pciephy_ctrl_157_we = reg_wr && dec_pciephy_ctrl_157;
// non-RO: output
assign cfg_pciephy_ctrl_157 = reg_pciephy_ctrl_157;
assign dec_pciephy_ctrl_158 = (reg_addr == 12'h278) ? 1'd1 : 1'd0;
assign pciephy_ctrl_158_we = reg_wr && dec_pciephy_ctrl_158;
// non-RO: output
assign cfg_pciephy_ctrl_158 = reg_pciephy_ctrl_158;
assign dec_pciephy_ctrl_159 = (reg_addr == 12'h27C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_159_we = reg_wr && dec_pciephy_ctrl_159;
// non-RO: output
assign cfg_pciephy_ctrl_159 = reg_pciephy_ctrl_159;
assign dec_pciephy_ctrl_160 = (reg_addr == 12'h280) ? 1'd1 : 1'd0;
assign pciephy_ctrl_160_we = reg_wr && dec_pciephy_ctrl_160;
// non-RO: output
assign cfg_pciephy_ctrl_160 = reg_pciephy_ctrl_160;
assign dec_pciephy_ctrl_161 = (reg_addr == 12'h284) ? 1'd1 : 1'd0;
assign pciephy_ctrl_161_we = reg_wr && dec_pciephy_ctrl_161;
// non-RO: output
assign cfg_pciephy_ctrl_161 = reg_pciephy_ctrl_161;
assign dec_pciephy_ctrl_162 = (reg_addr == 12'h288) ? 1'd1 : 1'd0;
assign pciephy_ctrl_162_we = reg_wr && dec_pciephy_ctrl_162;
// non-RO: output
assign cfg_pciephy_ctrl_162 = reg_pciephy_ctrl_162;
assign dec_pciephy_ctrl_163 = (reg_addr == 12'h28C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_163_we = reg_wr && dec_pciephy_ctrl_163;
// non-RO: output
assign cfg_pciephy_ctrl_163 = reg_pciephy_ctrl_163;
assign dec_pciephy_ctrl_164 = (reg_addr == 12'h290) ? 1'd1 : 1'd0;
assign pciephy_ctrl_164_we = reg_wr && dec_pciephy_ctrl_164;
// non-RO: output
assign cfg_pciephy_ctrl_164 = reg_pciephy_ctrl_164;
assign dec_pciephy_ctrl_165 = (reg_addr == 12'h294) ? 1'd1 : 1'd0;
assign pciephy_ctrl_165_we = reg_wr && dec_pciephy_ctrl_165;
// non-RO: output
assign cfg_pciephy_ctrl_165 = reg_pciephy_ctrl_165;
assign dec_pciephy_ctrl_166 = (reg_addr == 12'h298) ? 1'd1 : 1'd0;
assign pciephy_ctrl_166_we = reg_wr && dec_pciephy_ctrl_166;
// non-RO: output
assign cfg_pciephy_ctrl_166 = reg_pciephy_ctrl_166;
assign dec_pciephy_ctrl_167 = (reg_addr == 12'h29C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_167_we = reg_wr && dec_pciephy_ctrl_167;
// non-RO: output
assign cfg_pciephy_ctrl_167 = reg_pciephy_ctrl_167;
assign dec_pciephy_ctrl_168 = (reg_addr == 12'h2A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_168_we = reg_wr && dec_pciephy_ctrl_168;
// non-RO: output
assign cfg_pciephy_ctrl_168 = reg_pciephy_ctrl_168;
assign dec_pciephy_ctrl_169 = (reg_addr == 12'h2A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_169_we = reg_wr && dec_pciephy_ctrl_169;
// non-RO: output
assign cfg_pciephy_ctrl_169 = reg_pciephy_ctrl_169;
assign dec_pciephy_ctrl_170 = (reg_addr == 12'h2A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_170_we = reg_wr && dec_pciephy_ctrl_170;
// non-RO: output
assign cfg_pciephy_ctrl_170 = reg_pciephy_ctrl_170;
assign dec_pciephy_ctrl_171 = (reg_addr == 12'h2AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_171_we = reg_wr && dec_pciephy_ctrl_171;
// non-RO: output
assign cfg_pciephy_ctrl_171 = reg_pciephy_ctrl_171;
assign dec_pciephy_ctrl_172 = (reg_addr == 12'h2B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_172_we = reg_wr && dec_pciephy_ctrl_172;
// non-RO: output
assign cfg_pciephy_ctrl_172 = reg_pciephy_ctrl_172;
assign dec_pciephy_ctrl_173 = (reg_addr == 12'h2B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_173_we = reg_wr && dec_pciephy_ctrl_173;
// non-RO: output
assign cfg_pciephy_ctrl_173 = reg_pciephy_ctrl_173;
assign dec_pciephy_ctrl_174 = (reg_addr == 12'h2B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_174_we = reg_wr && dec_pciephy_ctrl_174;
// non-RO: output
assign cfg_pciephy_ctrl_174 = reg_pciephy_ctrl_174;
assign dec_pciephy_ctrl_175 = (reg_addr == 12'h2BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_175_we = reg_wr && dec_pciephy_ctrl_175;
// non-RO: output
assign cfg_pciephy_ctrl_175 = reg_pciephy_ctrl_175;
assign dec_pciephy_ctrl_176 = (reg_addr == 12'h2C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_176_we = reg_wr && dec_pciephy_ctrl_176;
// non-RO: output
assign cfg_pciephy_ctrl_176 = reg_pciephy_ctrl_176;
assign dec_pciephy_ctrl_177 = (reg_addr == 12'h2C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_177_we = reg_wr && dec_pciephy_ctrl_177;
// non-RO: output
assign cfg_pciephy_ctrl_177 = reg_pciephy_ctrl_177;
assign dec_pciephy_ctrl_178 = (reg_addr == 12'h2C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_178_we = reg_wr && dec_pciephy_ctrl_178;
// non-RO: output
assign cfg_pciephy_ctrl_178 = reg_pciephy_ctrl_178;
assign dec_pciephy_ctrl_179 = (reg_addr == 12'h2CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_179_we = reg_wr && dec_pciephy_ctrl_179;
// non-RO: output
assign cfg_pciephy_ctrl_179 = reg_pciephy_ctrl_179;
assign dec_pciephy_ctrl_180 = (reg_addr == 12'h2D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_180_we = reg_wr && dec_pciephy_ctrl_180;
// non-RO: output
assign cfg_pciephy_ctrl_180 = reg_pciephy_ctrl_180;
assign dec_pciephy_ctrl_181 = (reg_addr == 12'h2D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_181_we = reg_wr && dec_pciephy_ctrl_181;
// non-RO: output
assign cfg_pciephy_ctrl_181 = reg_pciephy_ctrl_181;
assign dec_pciephy_ctrl_182 = (reg_addr == 12'h2D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_182_we = reg_wr && dec_pciephy_ctrl_182;
// non-RO: output
assign cfg_pciephy_ctrl_182 = reg_pciephy_ctrl_182;
assign dec_pciephy_ctrl_183 = (reg_addr == 12'h2DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_183_we = reg_wr && dec_pciephy_ctrl_183;
// non-RO: output
assign cfg_pciephy_ctrl_183 = reg_pciephy_ctrl_183;
assign dec_pciephy_ctrl_184 = (reg_addr == 12'h2E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_184_we = reg_wr && dec_pciephy_ctrl_184;
// non-RO: output
assign cfg_pciephy_ctrl_184 = reg_pciephy_ctrl_184;
assign dec_pciephy_ctrl_185 = (reg_addr == 12'h2E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_185_we = reg_wr && dec_pciephy_ctrl_185;
// non-RO: output
assign cfg_pciephy_ctrl_185 = reg_pciephy_ctrl_185;
assign dec_pciephy_ctrl_186 = (reg_addr == 12'h2E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_186_we = reg_wr && dec_pciephy_ctrl_186;
// non-RO: output
assign cfg_pciephy_ctrl_186 = reg_pciephy_ctrl_186;
assign dec_pciephy_ctrl_187 = (reg_addr == 12'h2EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_187_we = reg_wr && dec_pciephy_ctrl_187;
// non-RO: output
assign cfg_pciephy_ctrl_187 = reg_pciephy_ctrl_187;
assign dec_pciephy_ctrl_188 = (reg_addr == 12'h2F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_188_we = reg_wr && dec_pciephy_ctrl_188;
// non-RO: output
assign cfg_pciephy_ctrl_188 = reg_pciephy_ctrl_188;
assign dec_pciephy_ctrl_189 = (reg_addr == 12'h2F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_189_we = reg_wr && dec_pciephy_ctrl_189;
// non-RO: output
assign cfg_pciephy_ctrl_189 = reg_pciephy_ctrl_189;
assign dec_pciephy_ctrl_190 = (reg_addr == 12'h2F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_190_we = reg_wr && dec_pciephy_ctrl_190;
// non-RO: output
assign cfg_pciephy_ctrl_190 = reg_pciephy_ctrl_190;
assign dec_pciephy_ctrl_191 = (reg_addr == 12'h2FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_191_we = reg_wr && dec_pciephy_ctrl_191;
// non-RO: output
assign cfg_pciephy_ctrl_191 = reg_pciephy_ctrl_191;
assign dec_pciephy_ctrl_192 = (reg_addr == 12'h300) ? 1'd1 : 1'd0;
assign pciephy_ctrl_192_we = reg_wr && dec_pciephy_ctrl_192;
// non-RO: output
assign cfg_pciephy_ctrl_192 = reg_pciephy_ctrl_192;
assign dec_pciephy_ctrl_193 = (reg_addr == 12'h304) ? 1'd1 : 1'd0;
assign pciephy_ctrl_193_we = reg_wr && dec_pciephy_ctrl_193;
// non-RO: output
assign cfg_pciephy_ctrl_193 = reg_pciephy_ctrl_193;
assign dec_pciephy_ctrl_194 = (reg_addr == 12'h308) ? 1'd1 : 1'd0;
assign pciephy_ctrl_194_we = reg_wr && dec_pciephy_ctrl_194;
// non-RO: output
assign cfg_pciephy_ctrl_194 = reg_pciephy_ctrl_194;
assign dec_pciephy_ctrl_195 = (reg_addr == 12'h30C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_195_we = reg_wr && dec_pciephy_ctrl_195;
// non-RO: output
assign cfg_pciephy_ctrl_195 = reg_pciephy_ctrl_195;
assign dec_pciephy_ctrl_196 = (reg_addr == 12'h310) ? 1'd1 : 1'd0;
assign pciephy_ctrl_196_we = reg_wr && dec_pciephy_ctrl_196;
// non-RO: output
assign cfg_pciephy_ctrl_196 = reg_pciephy_ctrl_196;
assign dec_pciephy_ctrl_197 = (reg_addr == 12'h314) ? 1'd1 : 1'd0;
assign pciephy_ctrl_197_we = reg_wr && dec_pciephy_ctrl_197;
// non-RO: output
assign cfg_pciephy_ctrl_197 = reg_pciephy_ctrl_197;
assign dec_pciephy_ctrl_198 = (reg_addr == 12'h318) ? 1'd1 : 1'd0;
assign pciephy_ctrl_198_we = reg_wr && dec_pciephy_ctrl_198;
// non-RO: output
assign cfg_pciephy_ctrl_198 = reg_pciephy_ctrl_198;
assign dec_pciephy_ctrl_199 = (reg_addr == 12'h31C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_199_we = reg_wr && dec_pciephy_ctrl_199;
// non-RO: output
assign cfg_pciephy_ctrl_199 = reg_pciephy_ctrl_199;
assign dec_pciephy_ctrl_200 = (reg_addr == 12'h320) ? 1'd1 : 1'd0;
assign pciephy_ctrl_200_we = reg_wr && dec_pciephy_ctrl_200;
// non-RO: output
assign cfg_pciephy_ctrl_200 = reg_pciephy_ctrl_200;
assign dec_pciephy_ctrl_201 = (reg_addr == 12'h324) ? 1'd1 : 1'd0;
assign pciephy_ctrl_201_we = reg_wr && dec_pciephy_ctrl_201;
// non-RO: output
assign cfg_pciephy_ctrl_201 = reg_pciephy_ctrl_201;
assign dec_pciephy_ctrl_202 = (reg_addr == 12'h328) ? 1'd1 : 1'd0;
assign pciephy_ctrl_202_we = reg_wr && dec_pciephy_ctrl_202;
// non-RO: output
assign cfg_pciephy_ctrl_202 = reg_pciephy_ctrl_202;
assign dec_pciephy_ctrl_203 = (reg_addr == 12'h32C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_203_we = reg_wr && dec_pciephy_ctrl_203;
// non-RO: output
assign cfg_pciephy_ctrl_203 = reg_pciephy_ctrl_203;
assign dec_pciephy_ctrl_204 = (reg_addr == 12'h330) ? 1'd1 : 1'd0;
assign pciephy_ctrl_204_we = reg_wr && dec_pciephy_ctrl_204;
// non-RO: output
assign cfg_pciephy_ctrl_204 = reg_pciephy_ctrl_204;
assign dec_pciephy_ctrl_205 = (reg_addr == 12'h334) ? 1'd1 : 1'd0;
assign pciephy_ctrl_205_we = reg_wr && dec_pciephy_ctrl_205;
// non-RO: output
assign cfg_pciephy_ctrl_205 = reg_pciephy_ctrl_205;
assign dec_pciephy_ctrl_206 = (reg_addr == 12'h338) ? 1'd1 : 1'd0;
assign pciephy_ctrl_206_we = reg_wr && dec_pciephy_ctrl_206;
// non-RO: output
assign cfg_pciephy_ctrl_206 = reg_pciephy_ctrl_206;
assign dec_pciephy_ctrl_207 = (reg_addr == 12'h33C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_207_we = reg_wr && dec_pciephy_ctrl_207;
// non-RO: output
assign cfg_pciephy_ctrl_207 = reg_pciephy_ctrl_207;
assign dec_pciephy_ctrl_208 = (reg_addr == 12'h340) ? 1'd1 : 1'd0;
assign pciephy_ctrl_208_we = reg_wr && dec_pciephy_ctrl_208;
// non-RO: output
assign cfg_pciephy_ctrl_208 = reg_pciephy_ctrl_208;
assign dec_pciephy_ctrl_209 = (reg_addr == 12'h344) ? 1'd1 : 1'd0;
assign pciephy_ctrl_209_we = reg_wr && dec_pciephy_ctrl_209;
// non-RO: output
assign cfg_pciephy_ctrl_209 = reg_pciephy_ctrl_209;
assign dec_pciephy_ctrl_210 = (reg_addr == 12'h348) ? 1'd1 : 1'd0;
assign pciephy_ctrl_210_we = reg_wr && dec_pciephy_ctrl_210;
// non-RO: output
assign cfg_pciephy_ctrl_210 = reg_pciephy_ctrl_210;
assign dec_pciephy_ctrl_211 = (reg_addr == 12'h34C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_211_we = reg_wr && dec_pciephy_ctrl_211;
// non-RO: output
assign cfg_pciephy_ctrl_211 = reg_pciephy_ctrl_211;
assign dec_pciephy_ctrl_212 = (reg_addr == 12'h350) ? 1'd1 : 1'd0;
assign pciephy_ctrl_212_we = reg_wr && dec_pciephy_ctrl_212;
// non-RO: output
assign cfg_pciephy_ctrl_212 = reg_pciephy_ctrl_212;
assign dec_pciephy_ctrl_213 = (reg_addr == 12'h354) ? 1'd1 : 1'd0;
assign pciephy_ctrl_213_we = reg_wr && dec_pciephy_ctrl_213;
// non-RO: output
assign cfg_pciephy_ctrl_213 = reg_pciephy_ctrl_213;
assign dec_pciephy_ctrl_214 = (reg_addr == 12'h358) ? 1'd1 : 1'd0;
assign pciephy_ctrl_214_we = reg_wr && dec_pciephy_ctrl_214;
// non-RO: output
assign cfg_pciephy_ctrl_214 = reg_pciephy_ctrl_214;
assign dec_pciephy_ctrl_215 = (reg_addr == 12'h35C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_215_we = reg_wr && dec_pciephy_ctrl_215;
// non-RO: output
assign cfg_pciephy_ctrl_215 = reg_pciephy_ctrl_215;
assign dec_pciephy_ctrl_216 = (reg_addr == 12'h360) ? 1'd1 : 1'd0;
assign pciephy_ctrl_216_we = reg_wr && dec_pciephy_ctrl_216;
// non-RO: output
assign cfg_pciephy_ctrl_216 = reg_pciephy_ctrl_216;
assign dec_pciephy_ctrl_217 = (reg_addr == 12'h364) ? 1'd1 : 1'd0;
assign pciephy_ctrl_217_we = reg_wr && dec_pciephy_ctrl_217;
// non-RO: output
assign cfg_pciephy_ctrl_217 = reg_pciephy_ctrl_217;
assign dec_pciephy_ctrl_218 = (reg_addr == 12'h368) ? 1'd1 : 1'd0;
assign pciephy_ctrl_218_we = reg_wr && dec_pciephy_ctrl_218;
// non-RO: output
assign cfg_pciephy_ctrl_218 = reg_pciephy_ctrl_218;
assign dec_pciephy_ctrl_219 = (reg_addr == 12'h36C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_219_we = reg_wr && dec_pciephy_ctrl_219;
// non-RO: output
assign cfg_pciephy_ctrl_219 = reg_pciephy_ctrl_219;
assign dec_pciephy_ctrl_220 = (reg_addr == 12'h370) ? 1'd1 : 1'd0;
assign pciephy_ctrl_220_we = reg_wr && dec_pciephy_ctrl_220;
// non-RO: output
assign cfg_pciephy_ctrl_220 = reg_pciephy_ctrl_220;
assign dec_pciephy_ctrl_221 = (reg_addr == 12'h374) ? 1'd1 : 1'd0;
assign pciephy_ctrl_221_we = reg_wr && dec_pciephy_ctrl_221;
// non-RO: output
assign cfg_pciephy_ctrl_221 = reg_pciephy_ctrl_221;
assign dec_pciephy_ctrl_222 = (reg_addr == 12'h378) ? 1'd1 : 1'd0;
assign pciephy_ctrl_222_we = reg_wr && dec_pciephy_ctrl_222;
// non-RO: output
assign cfg_pciephy_ctrl_222 = reg_pciephy_ctrl_222;
assign dec_pciephy_ctrl_223 = (reg_addr == 12'h37C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_223_we = reg_wr && dec_pciephy_ctrl_223;
// non-RO: output
assign cfg_pciephy_ctrl_223 = reg_pciephy_ctrl_223;
assign dec_pciephy_ctrl_224 = (reg_addr == 12'h380) ? 1'd1 : 1'd0;
assign pciephy_ctrl_224_we = reg_wr && dec_pciephy_ctrl_224;
// non-RO: output
assign cfg_pciephy_ctrl_224 = reg_pciephy_ctrl_224;
assign dec_pciephy_ctrl_225 = (reg_addr == 12'h384) ? 1'd1 : 1'd0;
assign pciephy_ctrl_225_we = reg_wr && dec_pciephy_ctrl_225;
// non-RO: output
assign cfg_pciephy_ctrl_225 = reg_pciephy_ctrl_225;
assign dec_pciephy_ctrl_226 = (reg_addr == 12'h388) ? 1'd1 : 1'd0;
assign pciephy_ctrl_226_we = reg_wr && dec_pciephy_ctrl_226;
// non-RO: output
assign cfg_pciephy_ctrl_226 = reg_pciephy_ctrl_226;
assign dec_pciephy_ctrl_227 = (reg_addr == 12'h38C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_227_we = reg_wr && dec_pciephy_ctrl_227;
// non-RO: output
assign cfg_pciephy_ctrl_227 = reg_pciephy_ctrl_227;
assign dec_pciephy_ctrl_228 = (reg_addr == 12'h390) ? 1'd1 : 1'd0;
assign pciephy_ctrl_228_we = reg_wr && dec_pciephy_ctrl_228;
// non-RO: output
assign cfg_pciephy_ctrl_228 = reg_pciephy_ctrl_228;
assign dec_pciephy_ctrl_229 = (reg_addr == 12'h394) ? 1'd1 : 1'd0;
assign pciephy_ctrl_229_we = reg_wr && dec_pciephy_ctrl_229;
// non-RO: output
assign cfg_pciephy_ctrl_229 = reg_pciephy_ctrl_229;
assign dec_pciephy_ctrl_230 = (reg_addr == 12'h398) ? 1'd1 : 1'd0;
assign pciephy_ctrl_230_we = reg_wr && dec_pciephy_ctrl_230;
// non-RO: output
assign cfg_pciephy_ctrl_230 = reg_pciephy_ctrl_230;
assign dec_pciephy_ctrl_231 = (reg_addr == 12'h39C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_231_we = reg_wr && dec_pciephy_ctrl_231;
// non-RO: output
assign cfg_pciephy_ctrl_231 = reg_pciephy_ctrl_231;
assign dec_pciephy_ctrl_232 = (reg_addr == 12'h3A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_232_we = reg_wr && dec_pciephy_ctrl_232;
// non-RO: output
assign cfg_pciephy_ctrl_232 = reg_pciephy_ctrl_232;
assign dec_pciephy_ctrl_233 = (reg_addr == 12'h3A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_233_we = reg_wr && dec_pciephy_ctrl_233;
// non-RO: output
assign cfg_pciephy_ctrl_233 = reg_pciephy_ctrl_233;
assign dec_pciephy_ctrl_234 = (reg_addr == 12'h3A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_234_we = reg_wr && dec_pciephy_ctrl_234;
// non-RO: output
assign cfg_pciephy_ctrl_234 = reg_pciephy_ctrl_234;
assign dec_pciephy_ctrl_235 = (reg_addr == 12'h3AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_235_we = reg_wr && dec_pciephy_ctrl_235;
// non-RO: output
assign cfg_pciephy_ctrl_235 = reg_pciephy_ctrl_235;
assign dec_pciephy_ctrl_236 = (reg_addr == 12'h3B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_236_we = reg_wr && dec_pciephy_ctrl_236;
// non-RO: output
assign cfg_pciephy_ctrl_236 = reg_pciephy_ctrl_236;
assign dec_pciephy_ctrl_237 = (reg_addr == 12'h3B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_237_we = reg_wr && dec_pciephy_ctrl_237;
// non-RO: output
assign cfg_pciephy_ctrl_237 = reg_pciephy_ctrl_237;
assign dec_pciephy_ctrl_238 = (reg_addr == 12'h3B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_238_we = reg_wr && dec_pciephy_ctrl_238;
// non-RO: output
assign cfg_pciephy_ctrl_238 = reg_pciephy_ctrl_238;
assign dec_pciephy_ctrl_239 = (reg_addr == 12'h3BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_239_we = reg_wr && dec_pciephy_ctrl_239;
// non-RO: output
assign cfg_pciephy_ctrl_239 = reg_pciephy_ctrl_239;
assign dec_pciephy_ctrl_240 = (reg_addr == 12'h3C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_240_we = reg_wr && dec_pciephy_ctrl_240;
// non-RO: output
assign cfg_pciephy_ctrl_240 = reg_pciephy_ctrl_240;
assign dec_pciephy_ctrl_241 = (reg_addr == 12'h3C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_241_we = reg_wr && dec_pciephy_ctrl_241;
// non-RO: output
assign cfg_pciephy_ctrl_241 = reg_pciephy_ctrl_241;
assign dec_pciephy_ctrl_242 = (reg_addr == 12'h3C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_242_we = reg_wr && dec_pciephy_ctrl_242;
// non-RO: output
assign cfg_pciephy_ctrl_242 = reg_pciephy_ctrl_242;
assign dec_pciephy_ctrl_243 = (reg_addr == 12'h3CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_243_we = reg_wr && dec_pciephy_ctrl_243;
// non-RO: output
assign cfg_pciephy_ctrl_243 = reg_pciephy_ctrl_243;
assign dec_pciephy_ctrl_244 = (reg_addr == 12'h3D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_244_we = reg_wr && dec_pciephy_ctrl_244;
// non-RO: output
assign cfg_pciephy_ctrl_244 = reg_pciephy_ctrl_244;
assign dec_pciephy_ctrl_245 = (reg_addr == 12'h3D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_245_we = reg_wr && dec_pciephy_ctrl_245;
// non-RO: output
assign cfg_pciephy_ctrl_245 = reg_pciephy_ctrl_245;
assign dec_pciephy_ctrl_246 = (reg_addr == 12'h3D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_246_we = reg_wr && dec_pciephy_ctrl_246;
// non-RO: output
assign cfg_pciephy_ctrl_246 = reg_pciephy_ctrl_246;
assign dec_pciephy_ctrl_247 = (reg_addr == 12'h3DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_247_we = reg_wr && dec_pciephy_ctrl_247;
// non-RO: output
assign cfg_pciephy_ctrl_247 = reg_pciephy_ctrl_247;
assign dec_pciephy_ctrl_248 = (reg_addr == 12'h3E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_248_we = reg_wr && dec_pciephy_ctrl_248;
// non-RO: output
assign cfg_pciephy_ctrl_248 = reg_pciephy_ctrl_248;
assign dec_pciephy_ctrl_249 = (reg_addr == 12'h3E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_249_we = reg_wr && dec_pciephy_ctrl_249;
// non-RO: output
assign cfg_pciephy_ctrl_249 = reg_pciephy_ctrl_249;
assign dec_pciephy_ctrl_250 = (reg_addr == 12'h3E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_250_we = reg_wr && dec_pciephy_ctrl_250;
// non-RO: output
assign cfg_pciephy_ctrl_250 = reg_pciephy_ctrl_250;
assign dec_pciephy_ctrl_251 = (reg_addr == 12'h3EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_251_we = reg_wr && dec_pciephy_ctrl_251;
// non-RO: output
assign cfg_pciephy_ctrl_251 = reg_pciephy_ctrl_251;
assign dec_pciephy_ctrl_252 = (reg_addr == 12'h3F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_252_we = reg_wr && dec_pciephy_ctrl_252;
// non-RO: output
assign cfg_pciephy_ctrl_252 = reg_pciephy_ctrl_252;
assign dec_pciephy_ctrl_253 = (reg_addr == 12'h3F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_253_we = reg_wr && dec_pciephy_ctrl_253;
// non-RO: output
assign cfg_pciephy_ctrl_253 = reg_pciephy_ctrl_253;
assign dec_pciephy_ctrl_254 = (reg_addr == 12'h3F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_254_we = reg_wr && dec_pciephy_ctrl_254;
// non-RO: output
assign cfg_pciephy_ctrl_254 = reg_pciephy_ctrl_254;
assign dec_pciephy_ctrl_255 = (reg_addr == 12'h3FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_255_we = reg_wr && dec_pciephy_ctrl_255;
// non-RO: output
assign cfg_pciephy_ctrl_255 = reg_pciephy_ctrl_255;
assign dec_pciephy_ctrl_256 = (reg_addr == 12'h400) ? 1'd1 : 1'd0;
assign pciephy_ctrl_256_we = reg_wr && dec_pciephy_ctrl_256;
// non-RO: output
assign cfg_pciephy_ctrl_256 = reg_pciephy_ctrl_256;
assign dec_pciephy_ctrl_257 = (reg_addr == 12'h404) ? 1'd1 : 1'd0;
assign pciephy_ctrl_257_we = reg_wr && dec_pciephy_ctrl_257;
// non-RO: output
assign cfg_pciephy_ctrl_257 = reg_pciephy_ctrl_257;
assign dec_pciephy_ctrl_258 = (reg_addr == 12'h408) ? 1'd1 : 1'd0;
assign pciephy_ctrl_258_we = reg_wr && dec_pciephy_ctrl_258;
// non-RO: output
assign cfg_pciephy_ctrl_258 = reg_pciephy_ctrl_258;
assign dec_pciephy_ctrl_259 = (reg_addr == 12'h40C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_259_we = reg_wr && dec_pciephy_ctrl_259;
// non-RO: output
assign cfg_pciephy_ctrl_259 = reg_pciephy_ctrl_259;
assign dec_pciephy_ctrl_260 = (reg_addr == 12'h410) ? 1'd1 : 1'd0;
assign pciephy_ctrl_260_we = reg_wr && dec_pciephy_ctrl_260;
// non-RO: output
assign cfg_pciephy_ctrl_260 = reg_pciephy_ctrl_260;
assign dec_pciephy_ctrl_261 = (reg_addr == 12'h414) ? 1'd1 : 1'd0;
assign pciephy_ctrl_261_we = reg_wr && dec_pciephy_ctrl_261;
// non-RO: output
assign cfg_pciephy_ctrl_261 = reg_pciephy_ctrl_261;
assign dec_pciephy_ctrl_262 = (reg_addr == 12'h418) ? 1'd1 : 1'd0;
assign pciephy_ctrl_262_we = reg_wr && dec_pciephy_ctrl_262;
// non-RO: output
assign cfg_pciephy_ctrl_262 = reg_pciephy_ctrl_262;
assign dec_pciephy_ctrl_263 = (reg_addr == 12'h41C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_263_we = reg_wr && dec_pciephy_ctrl_263;
// non-RO: output
assign cfg_pciephy_ctrl_263 = reg_pciephy_ctrl_263;
assign dec_pciephy_ctrl_264 = (reg_addr == 12'h420) ? 1'd1 : 1'd0;
assign pciephy_ctrl_264_we = reg_wr && dec_pciephy_ctrl_264;
// non-RO: output
assign cfg_pciephy_ctrl_264 = reg_pciephy_ctrl_264;
assign dec_pciephy_ctrl_265 = (reg_addr == 12'h424) ? 1'd1 : 1'd0;
assign pciephy_ctrl_265_we = reg_wr && dec_pciephy_ctrl_265;
// non-RO: output
assign cfg_pciephy_ctrl_265 = reg_pciephy_ctrl_265;
assign dec_pciephy_ctrl_266 = (reg_addr == 12'h428) ? 1'd1 : 1'd0;
assign pciephy_ctrl_266_we = reg_wr && dec_pciephy_ctrl_266;
// non-RO: output
assign cfg_pciephy_ctrl_266 = reg_pciephy_ctrl_266;
assign dec_pciephy_ctrl_267 = (reg_addr == 12'h42C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_267_we = reg_wr && dec_pciephy_ctrl_267;
// non-RO: output
assign cfg_pciephy_ctrl_267 = reg_pciephy_ctrl_267;
assign dec_pciephy_ctrl_268 = (reg_addr == 12'h430) ? 1'd1 : 1'd0;
assign pciephy_ctrl_268_we = reg_wr && dec_pciephy_ctrl_268;
// non-RO: output
assign cfg_pciephy_ctrl_268 = reg_pciephy_ctrl_268;
assign dec_pciephy_ctrl_269 = (reg_addr == 12'h434) ? 1'd1 : 1'd0;
assign pciephy_ctrl_269_we = reg_wr && dec_pciephy_ctrl_269;
// non-RO: output
assign cfg_pciephy_ctrl_269 = reg_pciephy_ctrl_269;
assign dec_pciephy_ctrl_270 = (reg_addr == 12'h438) ? 1'd1 : 1'd0;
assign pciephy_ctrl_270_we = reg_wr && dec_pciephy_ctrl_270;
// non-RO: output
assign cfg_pciephy_ctrl_270 = reg_pciephy_ctrl_270;
assign dec_pciephy_ctrl_271 = (reg_addr == 12'h43C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_271_we = reg_wr && dec_pciephy_ctrl_271;
// non-RO: output
assign cfg_pciephy_ctrl_271 = reg_pciephy_ctrl_271;
assign dec_pciephy_ctrl_272 = (reg_addr == 12'h440) ? 1'd1 : 1'd0;
assign pciephy_ctrl_272_we = reg_wr && dec_pciephy_ctrl_272;
// non-RO: output
assign cfg_pciephy_ctrl_272 = reg_pciephy_ctrl_272;
assign dec_pciephy_ctrl_273 = (reg_addr == 12'h444) ? 1'd1 : 1'd0;
assign pciephy_ctrl_273_we = reg_wr && dec_pciephy_ctrl_273;
// non-RO: output
assign cfg_pciephy_ctrl_273 = reg_pciephy_ctrl_273;
assign dec_pciephy_ctrl_274 = (reg_addr == 12'h448) ? 1'd1 : 1'd0;
assign pciephy_ctrl_274_we = reg_wr && dec_pciephy_ctrl_274;
// non-RO: output
assign cfg_pciephy_ctrl_274 = reg_pciephy_ctrl_274;
assign dec_pciephy_ctrl_275 = (reg_addr == 12'h44C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_275_we = reg_wr && dec_pciephy_ctrl_275;
// non-RO: output
assign cfg_pciephy_ctrl_275 = reg_pciephy_ctrl_275;
assign dec_pciephy_ctrl_276 = (reg_addr == 12'h450) ? 1'd1 : 1'd0;
assign pciephy_ctrl_276_we = reg_wr && dec_pciephy_ctrl_276;
// non-RO: output
assign cfg_pciephy_ctrl_276 = reg_pciephy_ctrl_276;
assign dec_pciephy_ctrl_277 = (reg_addr == 12'h454) ? 1'd1 : 1'd0;
assign pciephy_ctrl_277_we = reg_wr && dec_pciephy_ctrl_277;
// non-RO: output
assign cfg_pciephy_ctrl_277 = reg_pciephy_ctrl_277;
assign dec_pciephy_ctrl_278 = (reg_addr == 12'h458) ? 1'd1 : 1'd0;
assign pciephy_ctrl_278_we = reg_wr && dec_pciephy_ctrl_278;
// non-RO: output
assign cfg_pciephy_ctrl_278 = reg_pciephy_ctrl_278;
assign dec_pciephy_ctrl_279 = (reg_addr == 12'h45C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_279_we = reg_wr && dec_pciephy_ctrl_279;
// non-RO: output
assign cfg_pciephy_ctrl_279 = reg_pciephy_ctrl_279;
assign dec_pciephy_ctrl_280 = (reg_addr == 12'h460) ? 1'd1 : 1'd0;
assign pciephy_ctrl_280_we = reg_wr && dec_pciephy_ctrl_280;
// non-RO: output
assign cfg_pciephy_ctrl_280 = reg_pciephy_ctrl_280;
assign dec_pciephy_ctrl_281 = (reg_addr == 12'h464) ? 1'd1 : 1'd0;
assign pciephy_ctrl_281_we = reg_wr && dec_pciephy_ctrl_281;
// non-RO: output
assign cfg_pciephy_ctrl_281 = reg_pciephy_ctrl_281;
assign dec_pciephy_ctrl_282 = (reg_addr == 12'h468) ? 1'd1 : 1'd0;
assign pciephy_ctrl_282_we = reg_wr && dec_pciephy_ctrl_282;
// non-RO: output
assign cfg_pciephy_ctrl_282 = reg_pciephy_ctrl_282;
assign dec_pciephy_ctrl_283 = (reg_addr == 12'h46C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_283_we = reg_wr && dec_pciephy_ctrl_283;
// non-RO: output
assign cfg_pciephy_ctrl_283 = reg_pciephy_ctrl_283;
assign dec_pciephy_ctrl_284 = (reg_addr == 12'h470) ? 1'd1 : 1'd0;
assign pciephy_ctrl_284_we = reg_wr && dec_pciephy_ctrl_284;
// non-RO: output
assign cfg_pciephy_ctrl_284 = reg_pciephy_ctrl_284;
assign dec_pciephy_ctrl_285 = (reg_addr == 12'h474) ? 1'd1 : 1'd0;
assign pciephy_ctrl_285_we = reg_wr && dec_pciephy_ctrl_285;
// non-RO: output
assign cfg_pciephy_ctrl_285 = reg_pciephy_ctrl_285;
assign dec_pciephy_ctrl_286 = (reg_addr == 12'h478) ? 1'd1 : 1'd0;
assign pciephy_ctrl_286_we = reg_wr && dec_pciephy_ctrl_286;
// non-RO: output
assign cfg_pciephy_ctrl_286 = reg_pciephy_ctrl_286;
assign dec_pciephy_ctrl_287 = (reg_addr == 12'h47C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_287_we = reg_wr && dec_pciephy_ctrl_287;
// non-RO: output
assign cfg_pciephy_ctrl_287 = reg_pciephy_ctrl_287;
assign dec_pciephy_ctrl_288 = (reg_addr == 12'h480) ? 1'd1 : 1'd0;
assign pciephy_ctrl_288_we = reg_wr && dec_pciephy_ctrl_288;
// non-RO: output
assign cfg_pciephy_ctrl_288 = reg_pciephy_ctrl_288;
assign dec_pciephy_ctrl_289 = (reg_addr == 12'h484) ? 1'd1 : 1'd0;
assign pciephy_ctrl_289_we = reg_wr && dec_pciephy_ctrl_289;
// non-RO: output
assign cfg_pciephy_ctrl_289 = reg_pciephy_ctrl_289;
assign dec_pciephy_ctrl_290 = (reg_addr == 12'h488) ? 1'd1 : 1'd0;
assign pciephy_ctrl_290_we = reg_wr && dec_pciephy_ctrl_290;
// non-RO: output
assign cfg_pciephy_ctrl_290 = reg_pciephy_ctrl_290;
assign dec_pciephy_ctrl_291 = (reg_addr == 12'h48C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_291_we = reg_wr && dec_pciephy_ctrl_291;
// non-RO: output
assign cfg_pciephy_ctrl_291 = reg_pciephy_ctrl_291;
assign dec_pciephy_ctrl_292 = (reg_addr == 12'h490) ? 1'd1 : 1'd0;
assign pciephy_ctrl_292_we = reg_wr && dec_pciephy_ctrl_292;
// non-RO: output
assign cfg_pciephy_ctrl_292 = reg_pciephy_ctrl_292;
assign dec_pciephy_ctrl_293 = (reg_addr == 12'h494) ? 1'd1 : 1'd0;
assign pciephy_ctrl_293_we = reg_wr && dec_pciephy_ctrl_293;
// non-RO: output
assign cfg_pciephy_ctrl_293 = reg_pciephy_ctrl_293;
assign dec_pciephy_ctrl_294 = (reg_addr == 12'h498) ? 1'd1 : 1'd0;
assign pciephy_ctrl_294_we = reg_wr && dec_pciephy_ctrl_294;
// non-RO: output
assign cfg_pciephy_ctrl_294 = reg_pciephy_ctrl_294;
assign dec_pciephy_ctrl_295 = (reg_addr == 12'h49C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_295_we = reg_wr && dec_pciephy_ctrl_295;
// non-RO: output
assign cfg_pciephy_ctrl_295 = reg_pciephy_ctrl_295;
assign dec_pciephy_ctrl_296 = (reg_addr == 12'h4A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_296_we = reg_wr && dec_pciephy_ctrl_296;
// non-RO: output
assign cfg_pciephy_ctrl_296 = reg_pciephy_ctrl_296;
assign dec_pciephy_ctrl_297 = (reg_addr == 12'h4A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_297_we = reg_wr && dec_pciephy_ctrl_297;
// non-RO: output
assign cfg_pciephy_ctrl_297 = reg_pciephy_ctrl_297;
assign dec_pciephy_ctrl_298 = (reg_addr == 12'h4A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_298_we = reg_wr && dec_pciephy_ctrl_298;
// non-RO: output
assign cfg_pciephy_ctrl_298 = reg_pciephy_ctrl_298;
assign dec_pciephy_ctrl_299 = (reg_addr == 12'h4AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_299_we = reg_wr && dec_pciephy_ctrl_299;
// non-RO: output
assign cfg_pciephy_ctrl_299 = reg_pciephy_ctrl_299;
assign dec_pciephy_ctrl_300 = (reg_addr == 12'h4B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_300_we = reg_wr && dec_pciephy_ctrl_300;
// non-RO: output
assign cfg_pciephy_ctrl_300 = reg_pciephy_ctrl_300;
assign dec_pciephy_ctrl_301 = (reg_addr == 12'h4B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_301_we = reg_wr && dec_pciephy_ctrl_301;
// non-RO: output
assign cfg_pciephy_ctrl_301 = reg_pciephy_ctrl_301;
assign dec_pciephy_ctrl_302 = (reg_addr == 12'h4B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_302_we = reg_wr && dec_pciephy_ctrl_302;
// non-RO: output
assign cfg_pciephy_ctrl_302 = reg_pciephy_ctrl_302;
assign dec_pciephy_ctrl_303 = (reg_addr == 12'h4BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_303_we = reg_wr && dec_pciephy_ctrl_303;
// non-RO: output
assign cfg_pciephy_ctrl_303 = reg_pciephy_ctrl_303;
assign dec_pciephy_ctrl_304 = (reg_addr == 12'h4C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_304_we = reg_wr && dec_pciephy_ctrl_304;
// non-RO: output
assign cfg_pciephy_ctrl_304 = reg_pciephy_ctrl_304;
assign dec_pciephy_ctrl_305 = (reg_addr == 12'h4C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_305_we = reg_wr && dec_pciephy_ctrl_305;
// non-RO: output
assign cfg_pciephy_ctrl_305 = reg_pciephy_ctrl_305;
assign dec_pciephy_ctrl_306 = (reg_addr == 12'h4C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_306_we = reg_wr && dec_pciephy_ctrl_306;
// non-RO: output
assign cfg_pciephy_ctrl_306 = reg_pciephy_ctrl_306;
assign dec_pciephy_ctrl_307 = (reg_addr == 12'h4CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_307_we = reg_wr && dec_pciephy_ctrl_307;
// non-RO: output
assign cfg_pciephy_ctrl_307 = reg_pciephy_ctrl_307;
assign dec_pciephy_ctrl_308 = (reg_addr == 12'h4D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_308_we = reg_wr && dec_pciephy_ctrl_308;
// non-RO: output
assign cfg_pciephy_ctrl_308 = reg_pciephy_ctrl_308;
assign dec_pciephy_ctrl_309 = (reg_addr == 12'h4D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_309_we = reg_wr && dec_pciephy_ctrl_309;
// non-RO: output
assign cfg_pciephy_ctrl_309 = reg_pciephy_ctrl_309;
assign dec_pciephy_ctrl_310 = (reg_addr == 12'h4D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_310_we = reg_wr && dec_pciephy_ctrl_310;
// non-RO: output
assign cfg_pciephy_ctrl_310 = reg_pciephy_ctrl_310;
assign dec_pciephy_ctrl_311 = (reg_addr == 12'h4DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_311_we = reg_wr && dec_pciephy_ctrl_311;
// non-RO: output
assign cfg_pciephy_ctrl_311 = reg_pciephy_ctrl_311;
assign dec_pciephy_ctrl_312 = (reg_addr == 12'h4E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_312_we = reg_wr && dec_pciephy_ctrl_312;
// non-RO: output
assign cfg_pciephy_ctrl_312 = reg_pciephy_ctrl_312;
assign dec_pciephy_ctrl_313 = (reg_addr == 12'h4E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_313_we = reg_wr && dec_pciephy_ctrl_313;
// non-RO: output
assign cfg_pciephy_ctrl_313 = reg_pciephy_ctrl_313;
assign dec_pciephy_ctrl_314 = (reg_addr == 12'h4E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_314_we = reg_wr && dec_pciephy_ctrl_314;
// non-RO: output
assign cfg_pciephy_ctrl_314 = reg_pciephy_ctrl_314;
assign dec_pciephy_ctrl_315 = (reg_addr == 12'h4EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_315_we = reg_wr && dec_pciephy_ctrl_315;
// non-RO: output
assign cfg_pciephy_ctrl_315 = reg_pciephy_ctrl_315;
assign dec_pciephy_ctrl_316 = (reg_addr == 12'h4F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_316_we = reg_wr && dec_pciephy_ctrl_316;
// non-RO: output
assign cfg_pciephy_ctrl_316 = reg_pciephy_ctrl_316;
assign dec_pciephy_ctrl_317 = (reg_addr == 12'h4F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_317_we = reg_wr && dec_pciephy_ctrl_317;
// non-RO: output
assign cfg_pciephy_ctrl_317 = reg_pciephy_ctrl_317;
assign dec_pciephy_ctrl_318 = (reg_addr == 12'h4F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_318_we = reg_wr && dec_pciephy_ctrl_318;
// non-RO: output
assign cfg_pciephy_ctrl_318 = reg_pciephy_ctrl_318;
assign dec_pciephy_ctrl_319 = (reg_addr == 12'h4FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_319_we = reg_wr && dec_pciephy_ctrl_319;
// non-RO: output
assign cfg_pciephy_ctrl_319 = reg_pciephy_ctrl_319;
assign dec_pciephy_ctrl_320 = (reg_addr == 12'h500) ? 1'd1 : 1'd0;
assign pciephy_ctrl_320_we = reg_wr && dec_pciephy_ctrl_320;
// non-RO: output
assign cfg_pciephy_ctrl_320 = reg_pciephy_ctrl_320;
assign dec_pciephy_ctrl_321 = (reg_addr == 12'h504) ? 1'd1 : 1'd0;
assign pciephy_ctrl_321_we = reg_wr && dec_pciephy_ctrl_321;
// non-RO: output
assign cfg_pciephy_ctrl_321 = reg_pciephy_ctrl_321;
assign dec_pciephy_ctrl_322 = (reg_addr == 12'h508) ? 1'd1 : 1'd0;
assign pciephy_ctrl_322_we = reg_wr && dec_pciephy_ctrl_322;
// non-RO: output
assign cfg_pciephy_ctrl_322 = reg_pciephy_ctrl_322;
assign dec_pciephy_ctrl_323 = (reg_addr == 12'h50C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_323_we = reg_wr && dec_pciephy_ctrl_323;
// non-RO: output
assign cfg_pciephy_ctrl_323 = reg_pciephy_ctrl_323;
assign dec_pciephy_ctrl_324 = (reg_addr == 12'h510) ? 1'd1 : 1'd0;
assign pciephy_ctrl_324_we = reg_wr && dec_pciephy_ctrl_324;
// non-RO: output
assign cfg_pciephy_ctrl_324 = reg_pciephy_ctrl_324;
assign dec_pciephy_ctrl_325 = (reg_addr == 12'h514) ? 1'd1 : 1'd0;
assign pciephy_ctrl_325_we = reg_wr && dec_pciephy_ctrl_325;
// non-RO: output
assign cfg_pciephy_ctrl_325 = reg_pciephy_ctrl_325;
assign dec_pciephy_ctrl_326 = (reg_addr == 12'h518) ? 1'd1 : 1'd0;
assign pciephy_ctrl_326_we = reg_wr && dec_pciephy_ctrl_326;
// non-RO: output
assign cfg_pciephy_ctrl_326 = reg_pciephy_ctrl_326;
assign dec_pciephy_ctrl_327 = (reg_addr == 12'h51C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_327_we = reg_wr && dec_pciephy_ctrl_327;
// non-RO: output
assign cfg_pciephy_ctrl_327 = reg_pciephy_ctrl_327;
assign dec_pciephy_ctrl_328 = (reg_addr == 12'h520) ? 1'd1 : 1'd0;
assign pciephy_ctrl_328_we = reg_wr && dec_pciephy_ctrl_328;
// non-RO: output
assign cfg_pciephy_ctrl_328 = reg_pciephy_ctrl_328;
assign dec_pciephy_ctrl_329 = (reg_addr == 12'h524) ? 1'd1 : 1'd0;
assign pciephy_ctrl_329_we = reg_wr && dec_pciephy_ctrl_329;
// non-RO: output
assign cfg_pciephy_ctrl_329 = reg_pciephy_ctrl_329;
assign dec_pciephy_ctrl_330 = (reg_addr == 12'h528) ? 1'd1 : 1'd0;
assign pciephy_ctrl_330_we = reg_wr && dec_pciephy_ctrl_330;
// non-RO: output
assign cfg_pciephy_ctrl_330 = reg_pciephy_ctrl_330;
assign dec_pciephy_ctrl_331 = (reg_addr == 12'h52C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_331_we = reg_wr && dec_pciephy_ctrl_331;
// non-RO: output
assign cfg_pciephy_ctrl_331 = reg_pciephy_ctrl_331;
assign dec_pciephy_ctrl_332 = (reg_addr == 12'h530) ? 1'd1 : 1'd0;
assign pciephy_ctrl_332_we = reg_wr && dec_pciephy_ctrl_332;
// non-RO: output
assign cfg_pciephy_ctrl_332 = reg_pciephy_ctrl_332;
assign dec_pciephy_ctrl_333 = (reg_addr == 12'h534) ? 1'd1 : 1'd0;
assign pciephy_ctrl_333_we = reg_wr && dec_pciephy_ctrl_333;
// non-RO: output
assign cfg_pciephy_ctrl_333 = reg_pciephy_ctrl_333;
assign dec_pciephy_ctrl_334 = (reg_addr == 12'h538) ? 1'd1 : 1'd0;
assign pciephy_ctrl_334_we = reg_wr && dec_pciephy_ctrl_334;
// non-RO: output
assign cfg_pciephy_ctrl_334 = reg_pciephy_ctrl_334;
assign dec_pciephy_ctrl_335 = (reg_addr == 12'h53C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_335_we = reg_wr && dec_pciephy_ctrl_335;
// non-RO: output
assign cfg_pciephy_ctrl_335 = reg_pciephy_ctrl_335;
assign dec_pciephy_ctrl_336 = (reg_addr == 12'h540) ? 1'd1 : 1'd0;
assign pciephy_ctrl_336_we = reg_wr && dec_pciephy_ctrl_336;
// non-RO: output
assign cfg_pciephy_ctrl_336 = reg_pciephy_ctrl_336;
assign dec_pciephy_ctrl_337 = (reg_addr == 12'h544) ? 1'd1 : 1'd0;
assign pciephy_ctrl_337_we = reg_wr && dec_pciephy_ctrl_337;
// non-RO: output
assign cfg_pciephy_ctrl_337 = reg_pciephy_ctrl_337;
assign dec_pciephy_ctrl_338 = (reg_addr == 12'h548) ? 1'd1 : 1'd0;
assign pciephy_ctrl_338_we = reg_wr && dec_pciephy_ctrl_338;
// non-RO: output
assign cfg_pciephy_ctrl_338 = reg_pciephy_ctrl_338;
assign dec_pciephy_ctrl_339 = (reg_addr == 12'h54C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_339_we = reg_wr && dec_pciephy_ctrl_339;
// non-RO: output
assign cfg_pciephy_ctrl_339 = reg_pciephy_ctrl_339;
assign dec_pciephy_ctrl_340 = (reg_addr == 12'h550) ? 1'd1 : 1'd0;
assign pciephy_ctrl_340_we = reg_wr && dec_pciephy_ctrl_340;
// non-RO: output
assign cfg_pciephy_ctrl_340 = reg_pciephy_ctrl_340;
assign dec_pciephy_ctrl_341 = (reg_addr == 12'h554) ? 1'd1 : 1'd0;
assign pciephy_ctrl_341_we = reg_wr && dec_pciephy_ctrl_341;
// non-RO: output
assign cfg_pciephy_ctrl_341 = reg_pciephy_ctrl_341;
assign dec_pciephy_ctrl_342 = (reg_addr == 12'h558) ? 1'd1 : 1'd0;
assign pciephy_ctrl_342_we = reg_wr && dec_pciephy_ctrl_342;
// non-RO: output
assign cfg_pciephy_ctrl_342 = reg_pciephy_ctrl_342;
assign dec_pciephy_ctrl_343 = (reg_addr == 12'h55C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_343_we = reg_wr && dec_pciephy_ctrl_343;
// non-RO: output
assign cfg_pciephy_ctrl_343 = reg_pciephy_ctrl_343;
assign dec_pciephy_ctrl_344 = (reg_addr == 12'h560) ? 1'd1 : 1'd0;
assign pciephy_ctrl_344_we = reg_wr && dec_pciephy_ctrl_344;
// non-RO: output
assign cfg_pciephy_ctrl_344 = reg_pciephy_ctrl_344;
assign dec_pciephy_ctrl_345 = (reg_addr == 12'h564) ? 1'd1 : 1'd0;
assign pciephy_ctrl_345_we = reg_wr && dec_pciephy_ctrl_345;
// non-RO: output
assign cfg_pciephy_ctrl_345 = reg_pciephy_ctrl_345;
assign dec_pciephy_ctrl_346 = (reg_addr == 12'h568) ? 1'd1 : 1'd0;
assign pciephy_ctrl_346_we = reg_wr && dec_pciephy_ctrl_346;
// non-RO: output
assign cfg_pciephy_ctrl_346 = reg_pciephy_ctrl_346;
assign dec_pciephy_ctrl_347 = (reg_addr == 12'h56C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_347_we = reg_wr && dec_pciephy_ctrl_347;
// non-RO: output
assign cfg_pciephy_ctrl_347 = reg_pciephy_ctrl_347;
assign dec_pciephy_ctrl_348 = (reg_addr == 12'h570) ? 1'd1 : 1'd0;
assign pciephy_ctrl_348_we = reg_wr && dec_pciephy_ctrl_348;
// non-RO: output
assign cfg_pciephy_ctrl_348 = reg_pciephy_ctrl_348;
assign dec_pciephy_ctrl_349 = (reg_addr == 12'h574) ? 1'd1 : 1'd0;
assign pciephy_ctrl_349_we = reg_wr && dec_pciephy_ctrl_349;
// non-RO: output
assign cfg_pciephy_ctrl_349 = reg_pciephy_ctrl_349;
assign dec_pciephy_ctrl_350 = (reg_addr == 12'h578) ? 1'd1 : 1'd0;
assign pciephy_ctrl_350_we = reg_wr && dec_pciephy_ctrl_350;
// non-RO: output
assign cfg_pciephy_ctrl_350 = reg_pciephy_ctrl_350;
assign dec_pciephy_ctrl_351 = (reg_addr == 12'h57C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_351_we = reg_wr && dec_pciephy_ctrl_351;
// non-RO: output
assign cfg_pciephy_ctrl_351 = reg_pciephy_ctrl_351;
assign dec_pciephy_ctrl_352 = (reg_addr == 12'h580) ? 1'd1 : 1'd0;
assign pciephy_ctrl_352_we = reg_wr && dec_pciephy_ctrl_352;
// non-RO: output
assign cfg_pciephy_ctrl_352 = reg_pciephy_ctrl_352;
assign dec_pciephy_ctrl_353 = (reg_addr == 12'h584) ? 1'd1 : 1'd0;
assign pciephy_ctrl_353_we = reg_wr && dec_pciephy_ctrl_353;
// non-RO: output
assign cfg_pciephy_ctrl_353 = reg_pciephy_ctrl_353;
assign dec_pciephy_ctrl_354 = (reg_addr == 12'h588) ? 1'd1 : 1'd0;
assign pciephy_ctrl_354_we = reg_wr && dec_pciephy_ctrl_354;
// non-RO: output
assign cfg_pciephy_ctrl_354 = reg_pciephy_ctrl_354;
assign dec_pciephy_ctrl_355 = (reg_addr == 12'h58C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_355_we = reg_wr && dec_pciephy_ctrl_355;
// non-RO: output
assign cfg_pciephy_ctrl_355 = reg_pciephy_ctrl_355;
assign dec_pciephy_ctrl_356 = (reg_addr == 12'h590) ? 1'd1 : 1'd0;
assign pciephy_ctrl_356_we = reg_wr && dec_pciephy_ctrl_356;
// non-RO: output
assign cfg_pciephy_ctrl_356 = reg_pciephy_ctrl_356;
assign dec_pciephy_ctrl_357 = (reg_addr == 12'h594) ? 1'd1 : 1'd0;
assign pciephy_ctrl_357_we = reg_wr && dec_pciephy_ctrl_357;
// non-RO: output
assign cfg_pciephy_ctrl_357 = reg_pciephy_ctrl_357;
assign dec_pciephy_ctrl_358 = (reg_addr == 12'h598) ? 1'd1 : 1'd0;
assign pciephy_ctrl_358_we = reg_wr && dec_pciephy_ctrl_358;
// non-RO: output
assign cfg_pciephy_ctrl_358 = reg_pciephy_ctrl_358;
assign dec_pciephy_ctrl_359 = (reg_addr == 12'h59C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_359_we = reg_wr && dec_pciephy_ctrl_359;
// non-RO: output
assign cfg_pciephy_ctrl_359 = reg_pciephy_ctrl_359;
assign dec_pciephy_ctrl_360 = (reg_addr == 12'h5A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_360_we = reg_wr && dec_pciephy_ctrl_360;
// non-RO: output
assign cfg_pciephy_ctrl_360 = reg_pciephy_ctrl_360;
assign dec_pciephy_ctrl_361 = (reg_addr == 12'h5A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_361_we = reg_wr && dec_pciephy_ctrl_361;
// non-RO: output
assign cfg_pciephy_ctrl_361 = reg_pciephy_ctrl_361;
assign dec_pciephy_ctrl_362 = (reg_addr == 12'h5A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_362_we = reg_wr && dec_pciephy_ctrl_362;
// non-RO: output
assign cfg_pciephy_ctrl_362 = reg_pciephy_ctrl_362;
assign dec_pciephy_ctrl_363 = (reg_addr == 12'h5AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_363_we = reg_wr && dec_pciephy_ctrl_363;
// non-RO: output
assign cfg_pciephy_ctrl_363 = reg_pciephy_ctrl_363;
assign dec_pciephy_ctrl_364 = (reg_addr == 12'h5B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_364_we = reg_wr && dec_pciephy_ctrl_364;
// non-RO: output
assign cfg_pciephy_ctrl_364 = reg_pciephy_ctrl_364;
assign dec_pciephy_ctrl_365 = (reg_addr == 12'h5B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_365_we = reg_wr && dec_pciephy_ctrl_365;
// non-RO: output
assign cfg_pciephy_ctrl_365 = reg_pciephy_ctrl_365;
assign dec_pciephy_ctrl_366 = (reg_addr == 12'h5B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_366_we = reg_wr && dec_pciephy_ctrl_366;
// non-RO: output
assign cfg_pciephy_ctrl_366 = reg_pciephy_ctrl_366;
assign dec_pciephy_ctrl_367 = (reg_addr == 12'h5BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_367_we = reg_wr && dec_pciephy_ctrl_367;
// non-RO: output
assign cfg_pciephy_ctrl_367 = reg_pciephy_ctrl_367;
assign dec_pciephy_ctrl_368 = (reg_addr == 12'h5C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_368_we = reg_wr && dec_pciephy_ctrl_368;
// non-RO: output
assign cfg_pciephy_ctrl_368 = reg_pciephy_ctrl_368;
assign dec_pciephy_ctrl_369 = (reg_addr == 12'h5C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_369_we = reg_wr && dec_pciephy_ctrl_369;
// non-RO: output
assign cfg_pciephy_ctrl_369 = reg_pciephy_ctrl_369;
assign dec_pciephy_ctrl_370 = (reg_addr == 12'h5C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_370_we = reg_wr && dec_pciephy_ctrl_370;
// non-RO: output
assign cfg_pciephy_ctrl_370 = reg_pciephy_ctrl_370;
assign dec_pciephy_ctrl_371 = (reg_addr == 12'h5CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_371_we = reg_wr && dec_pciephy_ctrl_371;
// non-RO: output
assign cfg_pciephy_ctrl_371 = reg_pciephy_ctrl_371;
assign dec_pciephy_ctrl_372 = (reg_addr == 12'h5D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_372_we = reg_wr && dec_pciephy_ctrl_372;
// non-RO: output
assign cfg_pciephy_ctrl_372 = reg_pciephy_ctrl_372;
assign dec_pciephy_ctrl_373 = (reg_addr == 12'h5D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_373_we = reg_wr && dec_pciephy_ctrl_373;
// non-RO: output
assign cfg_pciephy_ctrl_373 = reg_pciephy_ctrl_373;
assign dec_pciephy_ctrl_374 = (reg_addr == 12'h5D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_374_we = reg_wr && dec_pciephy_ctrl_374;
// non-RO: output
assign cfg_pciephy_ctrl_374 = reg_pciephy_ctrl_374;
assign dec_pciephy_ctrl_375 = (reg_addr == 12'h5DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_375_we = reg_wr && dec_pciephy_ctrl_375;
// non-RO: output
assign cfg_pciephy_ctrl_375 = reg_pciephy_ctrl_375;
assign dec_pciephy_ctrl_376 = (reg_addr == 12'h5E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_376_we = reg_wr && dec_pciephy_ctrl_376;
// non-RO: output
assign cfg_pciephy_ctrl_376 = reg_pciephy_ctrl_376;
assign dec_pciephy_ctrl_377 = (reg_addr == 12'h5E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_377_we = reg_wr && dec_pciephy_ctrl_377;
// non-RO: output
assign cfg_pciephy_ctrl_377 = reg_pciephy_ctrl_377;
assign dec_pciephy_ctrl_378 = (reg_addr == 12'h5E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_378_we = reg_wr && dec_pciephy_ctrl_378;
// non-RO: output
assign cfg_pciephy_ctrl_378 = reg_pciephy_ctrl_378;
assign dec_pciephy_ctrl_379 = (reg_addr == 12'h5EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_379_we = reg_wr && dec_pciephy_ctrl_379;
// non-RO: output
assign cfg_pciephy_ctrl_379 = reg_pciephy_ctrl_379;
assign dec_pciephy_ctrl_380 = (reg_addr == 12'h5F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_380_we = reg_wr && dec_pciephy_ctrl_380;
// non-RO: output
assign cfg_pciephy_ctrl_380 = reg_pciephy_ctrl_380;
assign dec_pciephy_ctrl_381 = (reg_addr == 12'h5F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_381_we = reg_wr && dec_pciephy_ctrl_381;
// non-RO: output
assign cfg_pciephy_ctrl_381 = reg_pciephy_ctrl_381;
assign dec_pciephy_ctrl_382 = (reg_addr == 12'h5F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_382_we = reg_wr && dec_pciephy_ctrl_382;
// non-RO: output
assign cfg_pciephy_ctrl_382 = reg_pciephy_ctrl_382;
assign dec_pciephy_ctrl_383 = (reg_addr == 12'h5FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_383_we = reg_wr && dec_pciephy_ctrl_383;
// non-RO: output
assign cfg_pciephy_ctrl_383 = reg_pciephy_ctrl_383;
assign dec_pciephy_ctrl_384 = (reg_addr == 12'h600) ? 1'd1 : 1'd0;
assign pciephy_ctrl_384_we = reg_wr && dec_pciephy_ctrl_384;
// non-RO: output
assign cfg_pciephy_ctrl_384 = reg_pciephy_ctrl_384;
assign dec_pciephy_ctrl_385 = (reg_addr == 12'h604) ? 1'd1 : 1'd0;
assign pciephy_ctrl_385_we = reg_wr && dec_pciephy_ctrl_385;
// non-RO: output
assign cfg_pciephy_ctrl_385 = reg_pciephy_ctrl_385;
assign dec_pciephy_ctrl_386 = (reg_addr == 12'h608) ? 1'd1 : 1'd0;
assign pciephy_ctrl_386_we = reg_wr && dec_pciephy_ctrl_386;
// non-RO: output
assign cfg_pciephy_ctrl_386 = reg_pciephy_ctrl_386;
assign dec_pciephy_ctrl_387 = (reg_addr == 12'h60C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_387_we = reg_wr && dec_pciephy_ctrl_387;
// non-RO: output
assign cfg_pciephy_ctrl_387 = reg_pciephy_ctrl_387;
assign dec_pciephy_ctrl_388 = (reg_addr == 12'h610) ? 1'd1 : 1'd0;
assign pciephy_ctrl_388_we = reg_wr && dec_pciephy_ctrl_388;
// non-RO: output
assign cfg_pciephy_ctrl_388 = reg_pciephy_ctrl_388;
assign dec_pciephy_ctrl_389 = (reg_addr == 12'h614) ? 1'd1 : 1'd0;
assign pciephy_ctrl_389_we = reg_wr && dec_pciephy_ctrl_389;
// non-RO: output
assign cfg_pciephy_ctrl_389 = reg_pciephy_ctrl_389;
assign dec_pciephy_ctrl_390 = (reg_addr == 12'h618) ? 1'd1 : 1'd0;
assign pciephy_ctrl_390_we = reg_wr && dec_pciephy_ctrl_390;
// non-RO: output
assign cfg_pciephy_ctrl_390 = reg_pciephy_ctrl_390;
assign dec_pciephy_ctrl_391 = (reg_addr == 12'h61C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_391_we = reg_wr && dec_pciephy_ctrl_391;
// non-RO: output
assign cfg_pciephy_ctrl_391 = reg_pciephy_ctrl_391;
assign dec_pciephy_ctrl_392 = (reg_addr == 12'h620) ? 1'd1 : 1'd0;
assign pciephy_ctrl_392_we = reg_wr && dec_pciephy_ctrl_392;
// non-RO: output
assign cfg_pciephy_ctrl_392 = reg_pciephy_ctrl_392;
assign dec_pciephy_ctrl_393 = (reg_addr == 12'h624) ? 1'd1 : 1'd0;
assign pciephy_ctrl_393_we = reg_wr && dec_pciephy_ctrl_393;
// non-RO: output
assign cfg_pciephy_ctrl_393 = reg_pciephy_ctrl_393;
assign dec_pciephy_ctrl_394 = (reg_addr == 12'h628) ? 1'd1 : 1'd0;
assign pciephy_ctrl_394_we = reg_wr && dec_pciephy_ctrl_394;
// non-RO: output
assign cfg_pciephy_ctrl_394 = reg_pciephy_ctrl_394;
assign dec_pciephy_ctrl_395 = (reg_addr == 12'h62C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_395_we = reg_wr && dec_pciephy_ctrl_395;
// non-RO: output
assign cfg_pciephy_ctrl_395 = reg_pciephy_ctrl_395;
assign dec_pciephy_ctrl_396 = (reg_addr == 12'h630) ? 1'd1 : 1'd0;
assign pciephy_ctrl_396_we = reg_wr && dec_pciephy_ctrl_396;
// non-RO: output
assign cfg_pciephy_ctrl_396 = reg_pciephy_ctrl_396;
assign dec_pciephy_ctrl_397 = (reg_addr == 12'h634) ? 1'd1 : 1'd0;
assign pciephy_ctrl_397_we = reg_wr && dec_pciephy_ctrl_397;
// non-RO: output
assign cfg_pciephy_ctrl_397 = reg_pciephy_ctrl_397;
assign dec_pciephy_ctrl_398 = (reg_addr == 12'h638) ? 1'd1 : 1'd0;
assign pciephy_ctrl_398_we = reg_wr && dec_pciephy_ctrl_398;
// non-RO: output
assign cfg_pciephy_ctrl_398 = reg_pciephy_ctrl_398;
assign dec_pciephy_ctrl_399 = (reg_addr == 12'h63C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_399_we = reg_wr && dec_pciephy_ctrl_399;
// non-RO: output
assign cfg_pciephy_ctrl_399 = reg_pciephy_ctrl_399;
assign dec_pciephy_ctrl_400 = (reg_addr == 12'h640) ? 1'd1 : 1'd0;
assign pciephy_ctrl_400_we = reg_wr && dec_pciephy_ctrl_400;
// non-RO: output
assign cfg_pciephy_ctrl_400 = reg_pciephy_ctrl_400;
assign dec_pciephy_ctrl_401 = (reg_addr == 12'h644) ? 1'd1 : 1'd0;
assign pciephy_ctrl_401_we = reg_wr && dec_pciephy_ctrl_401;
// non-RO: output
assign cfg_pciephy_ctrl_401 = reg_pciephy_ctrl_401;
assign dec_pciephy_ctrl_402 = (reg_addr == 12'h648) ? 1'd1 : 1'd0;
assign pciephy_ctrl_402_we = reg_wr && dec_pciephy_ctrl_402;
// non-RO: output
assign cfg_pciephy_ctrl_402 = reg_pciephy_ctrl_402;
assign dec_pciephy_ctrl_403 = (reg_addr == 12'h64C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_403_we = reg_wr && dec_pciephy_ctrl_403;
// non-RO: output
assign cfg_pciephy_ctrl_403 = reg_pciephy_ctrl_403;
assign dec_pciephy_ctrl_404 = (reg_addr == 12'h650) ? 1'd1 : 1'd0;
assign pciephy_ctrl_404_we = reg_wr && dec_pciephy_ctrl_404;
// non-RO: output
assign cfg_pciephy_ctrl_404 = reg_pciephy_ctrl_404;
assign dec_pciephy_ctrl_405 = (reg_addr == 12'h654) ? 1'd1 : 1'd0;
assign pciephy_ctrl_405_we = reg_wr && dec_pciephy_ctrl_405;
// non-RO: output
assign cfg_pciephy_ctrl_405 = reg_pciephy_ctrl_405;
assign dec_pciephy_ctrl_406 = (reg_addr == 12'h658) ? 1'd1 : 1'd0;
assign pciephy_ctrl_406_we = reg_wr && dec_pciephy_ctrl_406;
// non-RO: output
assign cfg_pciephy_ctrl_406 = reg_pciephy_ctrl_406;
assign dec_pciephy_ctrl_407 = (reg_addr == 12'h65C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_407_we = reg_wr && dec_pciephy_ctrl_407;
// non-RO: output
assign cfg_pciephy_ctrl_407 = reg_pciephy_ctrl_407;
assign dec_pciephy_ctrl_408 = (reg_addr == 12'h660) ? 1'd1 : 1'd0;
assign pciephy_ctrl_408_we = reg_wr && dec_pciephy_ctrl_408;
// non-RO: output
assign cfg_pciephy_ctrl_408 = reg_pciephy_ctrl_408;
assign dec_pciephy_ctrl_409 = (reg_addr == 12'h664) ? 1'd1 : 1'd0;
assign pciephy_ctrl_409_we = reg_wr && dec_pciephy_ctrl_409;
// non-RO: output
assign cfg_pciephy_ctrl_409 = reg_pciephy_ctrl_409;
assign dec_pciephy_ctrl_410 = (reg_addr == 12'h668) ? 1'd1 : 1'd0;
assign pciephy_ctrl_410_we = reg_wr && dec_pciephy_ctrl_410;
// non-RO: output
assign cfg_pciephy_ctrl_410 = reg_pciephy_ctrl_410;
assign dec_pciephy_ctrl_411 = (reg_addr == 12'h66C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_411_we = reg_wr && dec_pciephy_ctrl_411;
// non-RO: output
assign cfg_pciephy_ctrl_411 = reg_pciephy_ctrl_411;
assign dec_pciephy_ctrl_412 = (reg_addr == 12'h670) ? 1'd1 : 1'd0;
assign pciephy_ctrl_412_we = reg_wr && dec_pciephy_ctrl_412;
// non-RO: output
assign cfg_pciephy_ctrl_412 = reg_pciephy_ctrl_412;
assign dec_pciephy_ctrl_413 = (reg_addr == 12'h674) ? 1'd1 : 1'd0;
assign pciephy_ctrl_413_we = reg_wr && dec_pciephy_ctrl_413;
// non-RO: output
assign cfg_pciephy_ctrl_413 = reg_pciephy_ctrl_413;
assign dec_pciephy_ctrl_414 = (reg_addr == 12'h678) ? 1'd1 : 1'd0;
assign pciephy_ctrl_414_we = reg_wr && dec_pciephy_ctrl_414;
// non-RO: output
assign cfg_pciephy_ctrl_414 = reg_pciephy_ctrl_414;
assign dec_pciephy_ctrl_415 = (reg_addr == 12'h67C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_415_we = reg_wr && dec_pciephy_ctrl_415;
// non-RO: output
assign cfg_pciephy_ctrl_415 = reg_pciephy_ctrl_415;
assign dec_pciephy_ctrl_416 = (reg_addr == 12'h680) ? 1'd1 : 1'd0;
assign pciephy_ctrl_416_we = reg_wr && dec_pciephy_ctrl_416;
// non-RO: output
assign cfg_pciephy_ctrl_416 = reg_pciephy_ctrl_416;
assign dec_pciephy_ctrl_417 = (reg_addr == 12'h684) ? 1'd1 : 1'd0;
assign pciephy_ctrl_417_we = reg_wr && dec_pciephy_ctrl_417;
// non-RO: output
assign cfg_pciephy_ctrl_417 = reg_pciephy_ctrl_417;
assign dec_pciephy_ctrl_418 = (reg_addr == 12'h688) ? 1'd1 : 1'd0;
assign pciephy_ctrl_418_we = reg_wr && dec_pciephy_ctrl_418;
// non-RO: output
assign cfg_pciephy_ctrl_418 = reg_pciephy_ctrl_418;
assign dec_pciephy_ctrl_419 = (reg_addr == 12'h68C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_419_we = reg_wr && dec_pciephy_ctrl_419;
// non-RO: output
assign cfg_pciephy_ctrl_419 = reg_pciephy_ctrl_419;
assign dec_pciephy_ctrl_420 = (reg_addr == 12'h690) ? 1'd1 : 1'd0;
assign pciephy_ctrl_420_we = reg_wr && dec_pciephy_ctrl_420;
// non-RO: output
assign cfg_pciephy_ctrl_420 = reg_pciephy_ctrl_420;
assign dec_pciephy_ctrl_421 = (reg_addr == 12'h694) ? 1'd1 : 1'd0;
assign pciephy_ctrl_421_we = reg_wr && dec_pciephy_ctrl_421;
// non-RO: output
assign cfg_pciephy_ctrl_421 = reg_pciephy_ctrl_421;
assign dec_pciephy_ctrl_422 = (reg_addr == 12'h698) ? 1'd1 : 1'd0;
assign pciephy_ctrl_422_we = reg_wr && dec_pciephy_ctrl_422;
// non-RO: output
assign cfg_pciephy_ctrl_422 = reg_pciephy_ctrl_422;
assign dec_pciephy_ctrl_423 = (reg_addr == 12'h69C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_423_we = reg_wr && dec_pciephy_ctrl_423;
// non-RO: output
assign cfg_pciephy_ctrl_423 = reg_pciephy_ctrl_423;
assign dec_pciephy_ctrl_424 = (reg_addr == 12'h6A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_424_we = reg_wr && dec_pciephy_ctrl_424;
// non-RO: output
assign cfg_pciephy_ctrl_424 = reg_pciephy_ctrl_424;
assign dec_pciephy_ctrl_425 = (reg_addr == 12'h6A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_425_we = reg_wr && dec_pciephy_ctrl_425;
// non-RO: output
assign cfg_pciephy_ctrl_425 = reg_pciephy_ctrl_425;
assign dec_pciephy_ctrl_426 = (reg_addr == 12'h6A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_426_we = reg_wr && dec_pciephy_ctrl_426;
// non-RO: output
assign cfg_pciephy_ctrl_426 = reg_pciephy_ctrl_426;
assign dec_pciephy_ctrl_427 = (reg_addr == 12'h6AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_427_we = reg_wr && dec_pciephy_ctrl_427;
// non-RO: output
assign cfg_pciephy_ctrl_427 = reg_pciephy_ctrl_427;
assign dec_pciephy_ctrl_428 = (reg_addr == 12'h6B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_428_we = reg_wr && dec_pciephy_ctrl_428;
// non-RO: output
assign cfg_pciephy_ctrl_428 = reg_pciephy_ctrl_428;
assign dec_pciephy_ctrl_429 = (reg_addr == 12'h6B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_429_we = reg_wr && dec_pciephy_ctrl_429;
// non-RO: output
assign cfg_pciephy_ctrl_429 = reg_pciephy_ctrl_429;
assign dec_pciephy_ctrl_430 = (reg_addr == 12'h6B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_430_we = reg_wr && dec_pciephy_ctrl_430;
// non-RO: output
assign cfg_pciephy_ctrl_430 = reg_pciephy_ctrl_430;
assign dec_pciephy_ctrl_431 = (reg_addr == 12'h6BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_431_we = reg_wr && dec_pciephy_ctrl_431;
// non-RO: output
assign cfg_pciephy_ctrl_431 = reg_pciephy_ctrl_431;
assign dec_pciephy_ctrl_432 = (reg_addr == 12'h6C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_432_we = reg_wr && dec_pciephy_ctrl_432;
// non-RO: output
assign cfg_pciephy_ctrl_432 = reg_pciephy_ctrl_432;
assign dec_pciephy_ctrl_433 = (reg_addr == 12'h6C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_433_we = reg_wr && dec_pciephy_ctrl_433;
// non-RO: output
assign cfg_pciephy_ctrl_433 = reg_pciephy_ctrl_433;
assign dec_pciephy_ctrl_434 = (reg_addr == 12'h6C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_434_we = reg_wr && dec_pciephy_ctrl_434;
// non-RO: output
assign cfg_pciephy_ctrl_434 = reg_pciephy_ctrl_434;
assign dec_pciephy_ctrl_435 = (reg_addr == 12'h6CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_435_we = reg_wr && dec_pciephy_ctrl_435;
// non-RO: output
assign cfg_pciephy_ctrl_435 = reg_pciephy_ctrl_435;
assign dec_pciephy_ctrl_436 = (reg_addr == 12'h6D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_436_we = reg_wr && dec_pciephy_ctrl_436;
// non-RO: output
assign cfg_pciephy_ctrl_436 = reg_pciephy_ctrl_436;
assign dec_pciephy_ctrl_437 = (reg_addr == 12'h6D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_437_we = reg_wr && dec_pciephy_ctrl_437;
// non-RO: output
assign cfg_pciephy_ctrl_437 = reg_pciephy_ctrl_437;
assign dec_pciephy_ctrl_438 = (reg_addr == 12'h6D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_438_we = reg_wr && dec_pciephy_ctrl_438;
// non-RO: output
assign cfg_pciephy_ctrl_438 = reg_pciephy_ctrl_438;
assign dec_pciephy_ctrl_439 = (reg_addr == 12'h6DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_439_we = reg_wr && dec_pciephy_ctrl_439;
// non-RO: output
assign cfg_pciephy_ctrl_439 = reg_pciephy_ctrl_439;
assign dec_pciephy_ctrl_440 = (reg_addr == 12'h6E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_440_we = reg_wr && dec_pciephy_ctrl_440;
// non-RO: output
assign cfg_pciephy_ctrl_440 = reg_pciephy_ctrl_440;
assign dec_pciephy_ctrl_441 = (reg_addr == 12'h6E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_441_we = reg_wr && dec_pciephy_ctrl_441;
// non-RO: output
assign cfg_pciephy_ctrl_441 = reg_pciephy_ctrl_441;
assign dec_pciephy_ctrl_442 = (reg_addr == 12'h6E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_442_we = reg_wr && dec_pciephy_ctrl_442;
// non-RO: output
assign cfg_pciephy_ctrl_442 = reg_pciephy_ctrl_442;
assign dec_pciephy_ctrl_443 = (reg_addr == 12'h6EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_443_we = reg_wr && dec_pciephy_ctrl_443;
// non-RO: output
assign cfg_pciephy_ctrl_443 = reg_pciephy_ctrl_443;
assign dec_pciephy_ctrl_444 = (reg_addr == 12'h6F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_444_we = reg_wr && dec_pciephy_ctrl_444;
// non-RO: output
assign cfg_pciephy_ctrl_444 = reg_pciephy_ctrl_444;
assign dec_pciephy_ctrl_445 = (reg_addr == 12'h6F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_445_we = reg_wr && dec_pciephy_ctrl_445;
// non-RO: output
assign cfg_pciephy_ctrl_445 = reg_pciephy_ctrl_445;
assign dec_pciephy_ctrl_446 = (reg_addr == 12'h6F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_446_we = reg_wr && dec_pciephy_ctrl_446;
// non-RO: output
assign cfg_pciephy_ctrl_446 = reg_pciephy_ctrl_446;
assign dec_pciephy_ctrl_447 = (reg_addr == 12'h6FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_447_we = reg_wr && dec_pciephy_ctrl_447;
// non-RO: output
assign cfg_pciephy_ctrl_447 = reg_pciephy_ctrl_447;
assign dec_pciephy_ctrl_448 = (reg_addr == 12'h700) ? 1'd1 : 1'd0;
assign pciephy_ctrl_448_we = reg_wr && dec_pciephy_ctrl_448;
// non-RO: output
assign cfg_pciephy_ctrl_448 = reg_pciephy_ctrl_448;
assign dec_pciephy_ctrl_449 = (reg_addr == 12'h704) ? 1'd1 : 1'd0;
assign pciephy_ctrl_449_we = reg_wr && dec_pciephy_ctrl_449;
// non-RO: output
assign cfg_pciephy_ctrl_449 = reg_pciephy_ctrl_449;
assign dec_pciephy_ctrl_450 = (reg_addr == 12'h708) ? 1'd1 : 1'd0;
assign pciephy_ctrl_450_we = reg_wr && dec_pciephy_ctrl_450;
// non-RO: output
assign cfg_pciephy_ctrl_450 = reg_pciephy_ctrl_450;
assign dec_pciephy_ctrl_451 = (reg_addr == 12'h70C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_451_we = reg_wr && dec_pciephy_ctrl_451;
// non-RO: output
assign cfg_pciephy_ctrl_451 = reg_pciephy_ctrl_451;
assign dec_pciephy_ctrl_452 = (reg_addr == 12'h710) ? 1'd1 : 1'd0;
assign pciephy_ctrl_452_we = reg_wr && dec_pciephy_ctrl_452;
// non-RO: output
assign cfg_pciephy_ctrl_452 = reg_pciephy_ctrl_452;
assign dec_pciephy_ctrl_453 = (reg_addr == 12'h714) ? 1'd1 : 1'd0;
assign pciephy_ctrl_453_we = reg_wr && dec_pciephy_ctrl_453;
// non-RO: output
assign cfg_pciephy_ctrl_453 = reg_pciephy_ctrl_453;
assign dec_pciephy_ctrl_454 = (reg_addr == 12'h718) ? 1'd1 : 1'd0;
assign pciephy_ctrl_454_we = reg_wr && dec_pciephy_ctrl_454;
// non-RO: output
assign cfg_pciephy_ctrl_454 = reg_pciephy_ctrl_454;
assign dec_pciephy_ctrl_455 = (reg_addr == 12'h71C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_455_we = reg_wr && dec_pciephy_ctrl_455;
// non-RO: output
assign cfg_pciephy_ctrl_455 = reg_pciephy_ctrl_455;
assign dec_pciephy_ctrl_456 = (reg_addr == 12'h720) ? 1'd1 : 1'd0;
assign pciephy_ctrl_456_we = reg_wr && dec_pciephy_ctrl_456;
// non-RO: output
assign cfg_pciephy_ctrl_456 = reg_pciephy_ctrl_456;
assign dec_pciephy_ctrl_457 = (reg_addr == 12'h724) ? 1'd1 : 1'd0;
assign pciephy_ctrl_457_we = reg_wr && dec_pciephy_ctrl_457;
// non-RO: output
assign cfg_pciephy_ctrl_457 = reg_pciephy_ctrl_457;
assign dec_pciephy_ctrl_458 = (reg_addr == 12'h728) ? 1'd1 : 1'd0;
assign pciephy_ctrl_458_we = reg_wr && dec_pciephy_ctrl_458;
// non-RO: output
assign cfg_pciephy_ctrl_458 = reg_pciephy_ctrl_458;
assign dec_pciephy_ctrl_459 = (reg_addr == 12'h72C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_459_we = reg_wr && dec_pciephy_ctrl_459;
// non-RO: output
assign cfg_pciephy_ctrl_459 = reg_pciephy_ctrl_459;
assign dec_pciephy_ctrl_460 = (reg_addr == 12'h730) ? 1'd1 : 1'd0;
assign pciephy_ctrl_460_we = reg_wr && dec_pciephy_ctrl_460;
// non-RO: output
assign cfg_pciephy_ctrl_460 = reg_pciephy_ctrl_460;
assign dec_pciephy_ctrl_461 = (reg_addr == 12'h734) ? 1'd1 : 1'd0;
assign pciephy_ctrl_461_we = reg_wr && dec_pciephy_ctrl_461;
// non-RO: output
assign cfg_pciephy_ctrl_461 = reg_pciephy_ctrl_461;
assign dec_pciephy_ctrl_462 = (reg_addr == 12'h738) ? 1'd1 : 1'd0;
assign pciephy_ctrl_462_we = reg_wr && dec_pciephy_ctrl_462;
// non-RO: output
assign cfg_pciephy_ctrl_462 = reg_pciephy_ctrl_462;
assign dec_pciephy_ctrl_463 = (reg_addr == 12'h73C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_463_we = reg_wr && dec_pciephy_ctrl_463;
// non-RO: output
assign cfg_pciephy_ctrl_463 = reg_pciephy_ctrl_463;
assign dec_pciephy_ctrl_464 = (reg_addr == 12'h740) ? 1'd1 : 1'd0;
assign pciephy_ctrl_464_we = reg_wr && dec_pciephy_ctrl_464;
// non-RO: output
assign cfg_pciephy_ctrl_464 = reg_pciephy_ctrl_464;
assign dec_pciephy_ctrl_465 = (reg_addr == 12'h744) ? 1'd1 : 1'd0;
assign pciephy_ctrl_465_we = reg_wr && dec_pciephy_ctrl_465;
// non-RO: output
assign cfg_pciephy_ctrl_465 = reg_pciephy_ctrl_465;
assign dec_pciephy_ctrl_466 = (reg_addr == 12'h748) ? 1'd1 : 1'd0;
assign pciephy_ctrl_466_we = reg_wr && dec_pciephy_ctrl_466;
// non-RO: output
assign cfg_pciephy_ctrl_466 = reg_pciephy_ctrl_466;
assign dec_pciephy_ctrl_467 = (reg_addr == 12'h74C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_467_we = reg_wr && dec_pciephy_ctrl_467;
// non-RO: output
assign cfg_pciephy_ctrl_467 = reg_pciephy_ctrl_467;
assign dec_pciephy_ctrl_468 = (reg_addr == 12'h750) ? 1'd1 : 1'd0;
assign pciephy_ctrl_468_we = reg_wr && dec_pciephy_ctrl_468;
// non-RO: output
assign cfg_pciephy_ctrl_468 = reg_pciephy_ctrl_468;
assign dec_pciephy_ctrl_469 = (reg_addr == 12'h754) ? 1'd1 : 1'd0;
assign pciephy_ctrl_469_we = reg_wr && dec_pciephy_ctrl_469;
// non-RO: output
assign cfg_pciephy_ctrl_469 = reg_pciephy_ctrl_469;
assign dec_pciephy_ctrl_470 = (reg_addr == 12'h758) ? 1'd1 : 1'd0;
assign pciephy_ctrl_470_we = reg_wr && dec_pciephy_ctrl_470;
// non-RO: output
assign cfg_pciephy_ctrl_470 = reg_pciephy_ctrl_470;
assign dec_pciephy_ctrl_471 = (reg_addr == 12'h75C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_471_we = reg_wr && dec_pciephy_ctrl_471;
// non-RO: output
assign cfg_pciephy_ctrl_471 = reg_pciephy_ctrl_471;
assign dec_pciephy_ctrl_472 = (reg_addr == 12'h760) ? 1'd1 : 1'd0;
assign pciephy_ctrl_472_we = reg_wr && dec_pciephy_ctrl_472;
// non-RO: output
assign cfg_pciephy_ctrl_472 = reg_pciephy_ctrl_472;
assign dec_pciephy_ctrl_473 = (reg_addr == 12'h764) ? 1'd1 : 1'd0;
assign pciephy_ctrl_473_we = reg_wr && dec_pciephy_ctrl_473;
// non-RO: output
assign cfg_pciephy_ctrl_473 = reg_pciephy_ctrl_473;
assign dec_pciephy_ctrl_474 = (reg_addr == 12'h768) ? 1'd1 : 1'd0;
assign pciephy_ctrl_474_we = reg_wr && dec_pciephy_ctrl_474;
// non-RO: output
assign cfg_pciephy_ctrl_474 = reg_pciephy_ctrl_474;
assign dec_pciephy_ctrl_475 = (reg_addr == 12'h76C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_475_we = reg_wr && dec_pciephy_ctrl_475;
// non-RO: output
assign cfg_pciephy_ctrl_475 = reg_pciephy_ctrl_475;
assign dec_pciephy_ctrl_476 = (reg_addr == 12'h770) ? 1'd1 : 1'd0;
assign pciephy_ctrl_476_we = reg_wr && dec_pciephy_ctrl_476;
// non-RO: output
assign cfg_pciephy_ctrl_476 = reg_pciephy_ctrl_476;
assign dec_pciephy_ctrl_477 = (reg_addr == 12'h774) ? 1'd1 : 1'd0;
assign pciephy_ctrl_477_we = reg_wr && dec_pciephy_ctrl_477;
// non-RO: output
assign cfg_pciephy_ctrl_477 = reg_pciephy_ctrl_477;
assign dec_pciephy_ctrl_478 = (reg_addr == 12'h778) ? 1'd1 : 1'd0;
assign pciephy_ctrl_478_we = reg_wr && dec_pciephy_ctrl_478;
// non-RO: output
assign cfg_pciephy_ctrl_478 = reg_pciephy_ctrl_478;
assign dec_pciephy_ctrl_479 = (reg_addr == 12'h77C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_479_we = reg_wr && dec_pciephy_ctrl_479;
// non-RO: output
assign cfg_pciephy_ctrl_479 = reg_pciephy_ctrl_479;
assign dec_pciephy_ctrl_480 = (reg_addr == 12'h780) ? 1'd1 : 1'd0;
assign pciephy_ctrl_480_we = reg_wr && dec_pciephy_ctrl_480;
// non-RO: output
assign cfg_pciephy_ctrl_480 = reg_pciephy_ctrl_480;
assign dec_pciephy_ctrl_481 = (reg_addr == 12'h784) ? 1'd1 : 1'd0;
assign pciephy_ctrl_481_we = reg_wr && dec_pciephy_ctrl_481;
// non-RO: output
assign cfg_pciephy_ctrl_481 = reg_pciephy_ctrl_481;
assign dec_pciephy_ctrl_482 = (reg_addr == 12'h788) ? 1'd1 : 1'd0;
assign pciephy_ctrl_482_we = reg_wr && dec_pciephy_ctrl_482;
// non-RO: output
assign cfg_pciephy_ctrl_482 = reg_pciephy_ctrl_482;
assign dec_pciephy_ctrl_483 = (reg_addr == 12'h78C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_483_we = reg_wr && dec_pciephy_ctrl_483;
// non-RO: output
assign cfg_pciephy_ctrl_483 = reg_pciephy_ctrl_483;
assign dec_pciephy_ctrl_484 = (reg_addr == 12'h790) ? 1'd1 : 1'd0;
assign pciephy_ctrl_484_we = reg_wr && dec_pciephy_ctrl_484;
// non-RO: output
assign cfg_pciephy_ctrl_484 = reg_pciephy_ctrl_484;
assign dec_pciephy_ctrl_485 = (reg_addr == 12'h794) ? 1'd1 : 1'd0;
assign pciephy_ctrl_485_we = reg_wr && dec_pciephy_ctrl_485;
// non-RO: output
assign cfg_pciephy_ctrl_485 = reg_pciephy_ctrl_485;
assign dec_pciephy_ctrl_486 = (reg_addr == 12'h798) ? 1'd1 : 1'd0;
assign pciephy_ctrl_486_we = reg_wr && dec_pciephy_ctrl_486;
// non-RO: output
assign cfg_pciephy_ctrl_486 = reg_pciephy_ctrl_486;
assign dec_pciephy_ctrl_487 = (reg_addr == 12'h79C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_487_we = reg_wr && dec_pciephy_ctrl_487;
// non-RO: output
assign cfg_pciephy_ctrl_487 = reg_pciephy_ctrl_487;
assign dec_pciephy_ctrl_488 = (reg_addr == 12'h7A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_488_we = reg_wr && dec_pciephy_ctrl_488;
// non-RO: output
assign cfg_pciephy_ctrl_488 = reg_pciephy_ctrl_488;
assign dec_pciephy_ctrl_489 = (reg_addr == 12'h7A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_489_we = reg_wr && dec_pciephy_ctrl_489;
// non-RO: output
assign cfg_pciephy_ctrl_489 = reg_pciephy_ctrl_489;
assign dec_pciephy_ctrl_490 = (reg_addr == 12'h7A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_490_we = reg_wr && dec_pciephy_ctrl_490;
// non-RO: output
assign cfg_pciephy_ctrl_490 = reg_pciephy_ctrl_490;
assign dec_pciephy_ctrl_491 = (reg_addr == 12'h7AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_491_we = reg_wr && dec_pciephy_ctrl_491;
// non-RO: output
assign cfg_pciephy_ctrl_491 = reg_pciephy_ctrl_491;
assign dec_pciephy_ctrl_492 = (reg_addr == 12'h7B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_492_we = reg_wr && dec_pciephy_ctrl_492;
// non-RO: output
assign cfg_pciephy_ctrl_492 = reg_pciephy_ctrl_492;
assign dec_pciephy_ctrl_493 = (reg_addr == 12'h7B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_493_we = reg_wr && dec_pciephy_ctrl_493;
// non-RO: output
assign cfg_pciephy_ctrl_493 = reg_pciephy_ctrl_493;
assign dec_pciephy_ctrl_494 = (reg_addr == 12'h7B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_494_we = reg_wr && dec_pciephy_ctrl_494;
// non-RO: output
assign cfg_pciephy_ctrl_494 = reg_pciephy_ctrl_494;
assign dec_pciephy_ctrl_495 = (reg_addr == 12'h7BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_495_we = reg_wr && dec_pciephy_ctrl_495;
// non-RO: output
assign cfg_pciephy_ctrl_495 = reg_pciephy_ctrl_495;
assign dec_pciephy_ctrl_496 = (reg_addr == 12'h7C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_496_we = reg_wr && dec_pciephy_ctrl_496;
// non-RO: output
assign cfg_pciephy_ctrl_496 = reg_pciephy_ctrl_496;
assign dec_pciephy_ctrl_497 = (reg_addr == 12'h7C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_497_we = reg_wr && dec_pciephy_ctrl_497;
// non-RO: output
assign cfg_pciephy_ctrl_497 = reg_pciephy_ctrl_497;
assign dec_pciephy_ctrl_498 = (reg_addr == 12'h7C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_498_we = reg_wr && dec_pciephy_ctrl_498;
// non-RO: output
assign cfg_pciephy_ctrl_498 = reg_pciephy_ctrl_498;
assign dec_pciephy_ctrl_499 = (reg_addr == 12'h7CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_499_we = reg_wr && dec_pciephy_ctrl_499;
// non-RO: output
assign cfg_pciephy_ctrl_499 = reg_pciephy_ctrl_499;
assign dec_pciephy_ctrl_500 = (reg_addr == 12'h7D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_500_we = reg_wr && dec_pciephy_ctrl_500;
// non-RO: output
assign cfg_pciephy_ctrl_500 = reg_pciephy_ctrl_500;
assign dec_pciephy_ctrl_501 = (reg_addr == 12'h7D4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_501_we = reg_wr && dec_pciephy_ctrl_501;
// non-RO: output
assign cfg_pciephy_ctrl_501 = reg_pciephy_ctrl_501;
assign dec_pciephy_ctrl_502 = (reg_addr == 12'h7D8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_502_we = reg_wr && dec_pciephy_ctrl_502;
// non-RO: output
assign cfg_pciephy_ctrl_502 = reg_pciephy_ctrl_502;
assign dec_pciephy_ctrl_503 = (reg_addr == 12'h7DC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_503_we = reg_wr && dec_pciephy_ctrl_503;
// non-RO: output
assign cfg_pciephy_ctrl_503 = reg_pciephy_ctrl_503;
assign dec_pciephy_ctrl_504 = (reg_addr == 12'h7E0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_504_we = reg_wr && dec_pciephy_ctrl_504;
// non-RO: output
assign cfg_pciephy_ctrl_504 = reg_pciephy_ctrl_504;
assign dec_pciephy_ctrl_505 = (reg_addr == 12'h7E4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_505_we = reg_wr && dec_pciephy_ctrl_505;
// non-RO: output
assign cfg_pciephy_ctrl_505 = reg_pciephy_ctrl_505;
assign dec_pciephy_ctrl_506 = (reg_addr == 12'h7E8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_506_we = reg_wr && dec_pciephy_ctrl_506;
// non-RO: output
assign cfg_pciephy_ctrl_506 = reg_pciephy_ctrl_506;
assign dec_pciephy_ctrl_507 = (reg_addr == 12'h7EC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_507_we = reg_wr && dec_pciephy_ctrl_507;
// non-RO: output
assign cfg_pciephy_ctrl_507 = reg_pciephy_ctrl_507;
assign dec_pciephy_ctrl_508 = (reg_addr == 12'h7F0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_508_we = reg_wr && dec_pciephy_ctrl_508;
// non-RO: output
assign cfg_pciephy_ctrl_508 = reg_pciephy_ctrl_508;
assign dec_pciephy_ctrl_509 = (reg_addr == 12'h7F4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_509_we = reg_wr && dec_pciephy_ctrl_509;
// non-RO: output
assign cfg_pciephy_ctrl_509 = reg_pciephy_ctrl_509;
assign dec_pciephy_ctrl_510 = (reg_addr == 12'h7F8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_510_we = reg_wr && dec_pciephy_ctrl_510;
// non-RO: output
assign cfg_pciephy_ctrl_510 = reg_pciephy_ctrl_510;
assign dec_pciephy_ctrl_511 = (reg_addr == 12'h7FC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_511_we = reg_wr && dec_pciephy_ctrl_511;
// non-RO: output
assign cfg_pciephy_ctrl_511 = reg_pciephy_ctrl_511;
assign dec_pciephy_ctrl_512 = (reg_addr == 12'h800) ? 1'd1 : 1'd0;
assign pciephy_ctrl_512_we = reg_wr && dec_pciephy_ctrl_512;
// non-RO: output
assign cfg_pciephy_ctrl_512 = reg_pciephy_ctrl_512;
assign dec_pciephy_ctrl_513 = (reg_addr == 12'h804) ? 1'd1 : 1'd0;
assign pciephy_ctrl_513_we = reg_wr && dec_pciephy_ctrl_513;
// non-RO: output
assign cfg_pciephy_ctrl_513 = reg_pciephy_ctrl_513;
assign dec_pciephy_ctrl_514 = (reg_addr == 12'h808) ? 1'd1 : 1'd0;
assign pciephy_ctrl_514_we = reg_wr && dec_pciephy_ctrl_514;
// non-RO: output
assign cfg_pciephy_ctrl_514 = reg_pciephy_ctrl_514;
assign dec_pciephy_ctrl_515 = (reg_addr == 12'h80C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_515_we = reg_wr && dec_pciephy_ctrl_515;
// non-RO: output
assign cfg_pciephy_ctrl_515 = reg_pciephy_ctrl_515;
assign dec_pciephy_ctrl_516 = (reg_addr == 12'h810) ? 1'd1 : 1'd0;
assign pciephy_ctrl_516_we = reg_wr && dec_pciephy_ctrl_516;
// non-RO: output
assign cfg_pciephy_ctrl_516 = reg_pciephy_ctrl_516;
assign dec_pciephy_ctrl_517 = (reg_addr == 12'h814) ? 1'd1 : 1'd0;
assign pciephy_ctrl_517_we = reg_wr && dec_pciephy_ctrl_517;
// non-RO: output
assign cfg_pciephy_ctrl_517 = reg_pciephy_ctrl_517;
assign dec_pciephy_ctrl_518 = (reg_addr == 12'h818) ? 1'd1 : 1'd0;
assign pciephy_ctrl_518_we = reg_wr && dec_pciephy_ctrl_518;
// non-RO: output
assign cfg_pciephy_ctrl_518 = reg_pciephy_ctrl_518;
assign dec_pciephy_ctrl_519 = (reg_addr == 12'h81C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_519_we = reg_wr && dec_pciephy_ctrl_519;
// non-RO: output
assign cfg_pciephy_ctrl_519 = reg_pciephy_ctrl_519;
assign dec_pciephy_ctrl_520 = (reg_addr == 12'h820) ? 1'd1 : 1'd0;
assign pciephy_ctrl_520_we = reg_wr && dec_pciephy_ctrl_520;
// non-RO: output
assign cfg_pciephy_ctrl_520 = reg_pciephy_ctrl_520;
assign dec_pciephy_ctrl_521 = (reg_addr == 12'h824) ? 1'd1 : 1'd0;
assign pciephy_ctrl_521_we = reg_wr && dec_pciephy_ctrl_521;
// non-RO: output
assign cfg_pciephy_ctrl_521 = reg_pciephy_ctrl_521;
assign dec_pciephy_ctrl_522 = (reg_addr == 12'h828) ? 1'd1 : 1'd0;
assign pciephy_ctrl_522_we = reg_wr && dec_pciephy_ctrl_522;
// non-RO: output
assign cfg_pciephy_ctrl_522 = reg_pciephy_ctrl_522;
assign dec_pciephy_ctrl_523 = (reg_addr == 12'h82C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_523_we = reg_wr && dec_pciephy_ctrl_523;
// non-RO: output
assign cfg_pciephy_ctrl_523 = reg_pciephy_ctrl_523;
assign dec_pciephy_ctrl_524 = (reg_addr == 12'h830) ? 1'd1 : 1'd0;
assign pciephy_ctrl_524_we = reg_wr && dec_pciephy_ctrl_524;
// non-RO: output
assign cfg_pciephy_ctrl_524 = reg_pciephy_ctrl_524;
assign dec_pciephy_ctrl_525 = (reg_addr == 12'h834) ? 1'd1 : 1'd0;
assign pciephy_ctrl_525_we = reg_wr && dec_pciephy_ctrl_525;
// non-RO: output
assign cfg_pciephy_ctrl_525 = reg_pciephy_ctrl_525;
assign dec_pciephy_ctrl_526 = (reg_addr == 12'h838) ? 1'd1 : 1'd0;
assign pciephy_ctrl_526_we = reg_wr && dec_pciephy_ctrl_526;
// non-RO: output
assign cfg_pciephy_ctrl_526 = reg_pciephy_ctrl_526;
assign dec_pciephy_ctrl_527 = (reg_addr == 12'h83C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_527_we = reg_wr && dec_pciephy_ctrl_527;
// non-RO: output
assign cfg_pciephy_ctrl_527 = reg_pciephy_ctrl_527;
assign dec_pciephy_ctrl_528 = (reg_addr == 12'h840) ? 1'd1 : 1'd0;
assign pciephy_ctrl_528_we = reg_wr && dec_pciephy_ctrl_528;
// non-RO: output
assign cfg_pciephy_ctrl_528 = reg_pciephy_ctrl_528;
assign dec_pciephy_ctrl_529 = (reg_addr == 12'h844) ? 1'd1 : 1'd0;
assign pciephy_ctrl_529_we = reg_wr && dec_pciephy_ctrl_529;
// non-RO: output
assign cfg_pciephy_ctrl_529 = reg_pciephy_ctrl_529;
assign dec_pciephy_ctrl_530 = (reg_addr == 12'h848) ? 1'd1 : 1'd0;
assign pciephy_ctrl_530_we = reg_wr && dec_pciephy_ctrl_530;
// non-RO: output
assign cfg_pciephy_ctrl_530 = reg_pciephy_ctrl_530;
assign dec_pciephy_ctrl_531 = (reg_addr == 12'h84C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_531_we = reg_wr && dec_pciephy_ctrl_531;
// non-RO: output
assign cfg_pciephy_ctrl_531 = reg_pciephy_ctrl_531;
assign dec_pciephy_ctrl_532 = (reg_addr == 12'h850) ? 1'd1 : 1'd0;
assign pciephy_ctrl_532_we = reg_wr && dec_pciephy_ctrl_532;
// non-RO: output
assign cfg_pciephy_ctrl_532 = reg_pciephy_ctrl_532;
assign dec_pciephy_ctrl_533 = (reg_addr == 12'h854) ? 1'd1 : 1'd0;
assign pciephy_ctrl_533_we = reg_wr && dec_pciephy_ctrl_533;
// non-RO: output
assign cfg_pciephy_ctrl_533 = reg_pciephy_ctrl_533;
assign dec_pciephy_ctrl_534 = (reg_addr == 12'h858) ? 1'd1 : 1'd0;
assign pciephy_ctrl_534_we = reg_wr && dec_pciephy_ctrl_534;
// non-RO: output
assign cfg_pciephy_ctrl_534 = reg_pciephy_ctrl_534;
assign dec_pciephy_ctrl_535 = (reg_addr == 12'h85C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_535_we = reg_wr && dec_pciephy_ctrl_535;
// non-RO: output
assign cfg_pciephy_ctrl_535 = reg_pciephy_ctrl_535;
assign dec_pciephy_ctrl_536 = (reg_addr == 12'h860) ? 1'd1 : 1'd0;
assign pciephy_ctrl_536_we = reg_wr && dec_pciephy_ctrl_536;
// non-RO: output
assign cfg_pciephy_ctrl_536 = reg_pciephy_ctrl_536;
assign dec_pciephy_ctrl_537 = (reg_addr == 12'h864) ? 1'd1 : 1'd0;
assign pciephy_ctrl_537_we = reg_wr && dec_pciephy_ctrl_537;
// non-RO: output
assign cfg_pciephy_ctrl_537 = reg_pciephy_ctrl_537;
assign dec_pciephy_ctrl_538 = (reg_addr == 12'h868) ? 1'd1 : 1'd0;
assign pciephy_ctrl_538_we = reg_wr && dec_pciephy_ctrl_538;
// non-RO: output
assign cfg_pciephy_ctrl_538 = reg_pciephy_ctrl_538;
assign dec_pciephy_ctrl_539 = (reg_addr == 12'h86C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_539_we = reg_wr && dec_pciephy_ctrl_539;
// non-RO: output
assign cfg_pciephy_ctrl_539 = reg_pciephy_ctrl_539;
assign dec_pciephy_ctrl_540 = (reg_addr == 12'h870) ? 1'd1 : 1'd0;
assign pciephy_ctrl_540_we = reg_wr && dec_pciephy_ctrl_540;
// non-RO: output
assign cfg_pciephy_ctrl_540 = reg_pciephy_ctrl_540;
assign dec_pciephy_ctrl_541 = (reg_addr == 12'h874) ? 1'd1 : 1'd0;
assign pciephy_ctrl_541_we = reg_wr && dec_pciephy_ctrl_541;
// non-RO: output
assign cfg_pciephy_ctrl_541 = reg_pciephy_ctrl_541;
assign dec_pciephy_ctrl_542 = (reg_addr == 12'h878) ? 1'd1 : 1'd0;
assign pciephy_ctrl_542_we = reg_wr && dec_pciephy_ctrl_542;
// non-RO: output
assign cfg_pciephy_ctrl_542 = reg_pciephy_ctrl_542;
assign dec_pciephy_ctrl_543 = (reg_addr == 12'h87C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_543_we = reg_wr && dec_pciephy_ctrl_543;
// non-RO: output
assign cfg_pciephy_ctrl_543 = reg_pciephy_ctrl_543;
assign dec_pciephy_ctrl_544 = (reg_addr == 12'h880) ? 1'd1 : 1'd0;
assign pciephy_ctrl_544_we = reg_wr && dec_pciephy_ctrl_544;
// non-RO: output
assign cfg_pciephy_ctrl_544 = reg_pciephy_ctrl_544;
assign dec_pciephy_ctrl_545 = (reg_addr == 12'h884) ? 1'd1 : 1'd0;
assign pciephy_ctrl_545_we = reg_wr && dec_pciephy_ctrl_545;
// non-RO: output
assign cfg_pciephy_ctrl_545 = reg_pciephy_ctrl_545;
assign dec_pciephy_ctrl_546 = (reg_addr == 12'h888) ? 1'd1 : 1'd0;
assign pciephy_ctrl_546_we = reg_wr && dec_pciephy_ctrl_546;
// non-RO: output
assign cfg_pciephy_ctrl_546 = reg_pciephy_ctrl_546;
assign dec_pciephy_ctrl_547 = (reg_addr == 12'h88C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_547_we = reg_wr && dec_pciephy_ctrl_547;
// non-RO: output
assign cfg_pciephy_ctrl_547 = reg_pciephy_ctrl_547;
assign dec_pciephy_ctrl_548 = (reg_addr == 12'h890) ? 1'd1 : 1'd0;
assign pciephy_ctrl_548_we = reg_wr && dec_pciephy_ctrl_548;
// non-RO: output
assign cfg_pciephy_ctrl_548 = reg_pciephy_ctrl_548;
assign dec_pciephy_ctrl_549 = (reg_addr == 12'h894) ? 1'd1 : 1'd0;
assign pciephy_ctrl_549_we = reg_wr && dec_pciephy_ctrl_549;
// non-RO: output
assign cfg_pciephy_ctrl_549 = reg_pciephy_ctrl_549;
assign dec_pciephy_ctrl_550 = (reg_addr == 12'h898) ? 1'd1 : 1'd0;
assign pciephy_ctrl_550_we = reg_wr && dec_pciephy_ctrl_550;
// non-RO: output
assign cfg_pciephy_ctrl_550 = reg_pciephy_ctrl_550;
assign dec_pciephy_ctrl_551 = (reg_addr == 12'h89C) ? 1'd1 : 1'd0;
assign pciephy_ctrl_551_we = reg_wr && dec_pciephy_ctrl_551;
// non-RO: output
assign cfg_pciephy_ctrl_551 = reg_pciephy_ctrl_551;
assign dec_pciephy_ctrl_552 = (reg_addr == 12'h8A0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_552_we = reg_wr && dec_pciephy_ctrl_552;
// non-RO: output
assign cfg_pciephy_ctrl_552 = reg_pciephy_ctrl_552;
assign dec_pciephy_ctrl_553 = (reg_addr == 12'h8A4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_553_we = reg_wr && dec_pciephy_ctrl_553;
// non-RO: output
assign cfg_pciephy_ctrl_553 = reg_pciephy_ctrl_553;
assign dec_pciephy_ctrl_554 = (reg_addr == 12'h8A8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_554_we = reg_wr && dec_pciephy_ctrl_554;
// non-RO: output
assign cfg_pciephy_ctrl_554 = reg_pciephy_ctrl_554;
assign dec_pciephy_ctrl_555 = (reg_addr == 12'h8AC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_555_we = reg_wr && dec_pciephy_ctrl_555;
// non-RO: output
assign cfg_pciephy_ctrl_555 = reg_pciephy_ctrl_555;
assign dec_pciephy_ctrl_556 = (reg_addr == 12'h8B0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_556_we = reg_wr && dec_pciephy_ctrl_556;
// non-RO: output
assign cfg_pciephy_ctrl_556 = reg_pciephy_ctrl_556;
assign dec_pciephy_ctrl_557 = (reg_addr == 12'h8B4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_557_we = reg_wr && dec_pciephy_ctrl_557;
// non-RO: output
assign cfg_pciephy_ctrl_557 = reg_pciephy_ctrl_557;
assign dec_pciephy_ctrl_558 = (reg_addr == 12'h8B8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_558_we = reg_wr && dec_pciephy_ctrl_558;
// non-RO: output
assign cfg_pciephy_ctrl_558 = reg_pciephy_ctrl_558;
assign dec_pciephy_ctrl_559 = (reg_addr == 12'h8BC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_559_we = reg_wr && dec_pciephy_ctrl_559;
// non-RO: output
assign cfg_pciephy_ctrl_559 = reg_pciephy_ctrl_559;
assign dec_pciephy_ctrl_560 = (reg_addr == 12'h8C0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_560_we = reg_wr && dec_pciephy_ctrl_560;
// non-RO: output
assign cfg_pciephy_ctrl_560 = reg_pciephy_ctrl_560;
assign dec_pciephy_ctrl_561 = (reg_addr == 12'h8C4) ? 1'd1 : 1'd0;
assign pciephy_ctrl_561_we = reg_wr && dec_pciephy_ctrl_561;
// non-RO: output
assign cfg_pciephy_ctrl_561 = reg_pciephy_ctrl_561;
assign dec_pciephy_ctrl_562 = (reg_addr == 12'h8C8) ? 1'd1 : 1'd0;
assign pciephy_ctrl_562_we = reg_wr && dec_pciephy_ctrl_562;
// non-RO: output
assign cfg_pciephy_ctrl_562 = reg_pciephy_ctrl_562;
assign dec_pciephy_ctrl_563 = (reg_addr == 12'h8CC) ? 1'd1 : 1'd0;
assign pciephy_ctrl_563_we = reg_wr && dec_pciephy_ctrl_563;
// non-RO: output
assign cfg_pciephy_ctrl_563 = reg_pciephy_ctrl_563;
assign dec_pciephy_ctrl_564 = (reg_addr == 12'h8D0) ? 1'd1 : 1'd0;
assign pciephy_ctrl_564_we = reg_wr && dec_pciephy_ctrl_564;
// non-RO: output
assign cfg_pciephy_ctrl_564 = reg_pciephy_ctrl_564;
assign dec_pciephy_ctrl_565 = (reg_addr == 12'h8D4) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_565 = cfg_pciephy_ctrl_565;
assign dec_pciephy_ctrl_566 = (reg_addr == 12'h8D8) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_566 = cfg_pciephy_ctrl_566;
assign dec_pciephy_ctrl_567 = (reg_addr == 12'h8DC) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_567 = cfg_pciephy_ctrl_567;
assign dec_pciephy_ctrl_568 = (reg_addr == 12'h8E0) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_568 = cfg_pciephy_ctrl_568;
assign dec_pciephy_ctrl_569 = (reg_addr == 12'h8E4) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_569 = cfg_pciephy_ctrl_569;
assign dec_pciephy_ctrl_570 = (reg_addr == 12'h8E8) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_570 = cfg_pciephy_ctrl_570;
assign dec_pciephy_ctrl_571 = (reg_addr == 12'h8EC) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_571 = cfg_pciephy_ctrl_571;
assign dec_pciephy_ctrl_572 = (reg_addr == 12'h8F0) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_572 = cfg_pciephy_ctrl_572;
assign dec_pciephy_ctrl_573 = (reg_addr == 12'h8F4) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_573 = cfg_pciephy_ctrl_573;
assign dec_pciephy_ctrl_574 = (reg_addr == 12'h8F8) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_574 = cfg_pciephy_ctrl_574;
assign dec_pciephy_ctrl_575 = (reg_addr == 12'h8FC) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_575 = cfg_pciephy_ctrl_575;
assign dec_pciephy_ctrl_576 = (reg_addr == 12'h900) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_576 = cfg_pciephy_ctrl_576;
assign dec_pciephy_ctrl_577 = (reg_addr == 12'h904) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_577 = cfg_pciephy_ctrl_577;
assign dec_pciephy_ctrl_578 = (reg_addr == 12'h908) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_578 = cfg_pciephy_ctrl_578;
assign dec_pciephy_ctrl_579 = (reg_addr == 12'h90C) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_579 = cfg_pciephy_ctrl_579;
assign dec_pciephy_ctrl_580 = (reg_addr == 12'h910) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_580 = cfg_pciephy_ctrl_580;
assign dec_pciephy_ctrl_581 = (reg_addr == 12'h914) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_581 = cfg_pciephy_ctrl_581;
assign dec_pciephy_ctrl_582 = (reg_addr == 12'h918) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_582 = cfg_pciephy_ctrl_582;
assign dec_pciephy_ctrl_583 = (reg_addr == 12'h91C) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_583 = cfg_pciephy_ctrl_583;
assign dec_pciephy_ctrl_584 = (reg_addr == 12'h920) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_584 = cfg_pciephy_ctrl_584;
assign dec_pciephy_ctrl_585 = (reg_addr == 12'h924) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_585 = cfg_pciephy_ctrl_585;
assign dec_pciephy_ctrl_586 = (reg_addr == 12'h928) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_586 = cfg_pciephy_ctrl_586;
assign dec_pciephy_ctrl_587 = (reg_addr == 12'h92C) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_587 = cfg_pciephy_ctrl_587;
assign dec_pciephy_ctrl_588 = (reg_addr == 12'h930) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_588 = cfg_pciephy_ctrl_588;
assign dec_pciephy_ctrl_589 = (reg_addr == 12'h934) ? 1'd1 : 1'd0;
// RO reg: input
assign reg_pciephy_ctrl_589 = cfg_pciephy_ctrl_589;
assign in_range = |{dec_pciephy_ctrl_0,
dec_pciephy_ctrl_1,
dec_pciephy_ctrl_2,
dec_pciephy_ctrl_3,
dec_pciephy_ctrl_4,
dec_pciephy_ctrl_5,
dec_pciephy_ctrl_6,
dec_pciephy_ctrl_7,
dec_pciephy_ctrl_8,
dec_pciephy_ctrl_9,
dec_pciephy_ctrl_10,
dec_pciephy_ctrl_11,
dec_pciephy_ctrl_12,
dec_pciephy_ctrl_13,
dec_pciephy_ctrl_14,
dec_pciephy_ctrl_15,
dec_pciephy_ctrl_16,
dec_pciephy_ctrl_17,
dec_pciephy_ctrl_18,
dec_pciephy_ctrl_19,
dec_pciephy_ctrl_20,
dec_pciephy_ctrl_21,
dec_pciephy_ctrl_22,
dec_pciephy_ctrl_23,
dec_pciephy_ctrl_24,
dec_pciephy_ctrl_25,
dec_pciephy_ctrl_26,
dec_pciephy_ctrl_27,
dec_pciephy_ctrl_28,
dec_pciephy_ctrl_29,
dec_pciephy_ctrl_30,
dec_pciephy_ctrl_31,
dec_pciephy_ctrl_32,
dec_pciephy_ctrl_33,
dec_pciephy_ctrl_34,
dec_pciephy_ctrl_35,
dec_pciephy_ctrl_36,
dec_pciephy_ctrl_37,
dec_pciephy_ctrl_38,
dec_pciephy_ctrl_39,
dec_pciephy_ctrl_40,
dec_pciephy_ctrl_41,
dec_pciephy_ctrl_42,
dec_pciephy_ctrl_43,
dec_pciephy_ctrl_44,
dec_pciephy_ctrl_45,
dec_pciephy_ctrl_46,
dec_pciephy_ctrl_47,
dec_pciephy_ctrl_48,
dec_pciephy_ctrl_49,
dec_pciephy_ctrl_50,
dec_pciephy_ctrl_51,
dec_pciephy_ctrl_52,
dec_pciephy_ctrl_53,
dec_pciephy_ctrl_54,
dec_pciephy_ctrl_55,
dec_pciephy_ctrl_56,
dec_pciephy_ctrl_57,
dec_pciephy_ctrl_58,
dec_pciephy_ctrl_59,
dec_pciephy_ctrl_60,
dec_pciephy_ctrl_61,
dec_pciephy_ctrl_62,
dec_pciephy_ctrl_63,
dec_pciephy_ctrl_64,
dec_pciephy_ctrl_65,
dec_pciephy_ctrl_66,
dec_pciephy_ctrl_67,
dec_pciephy_ctrl_68,
dec_pciephy_ctrl_69,
dec_pciephy_ctrl_70,
dec_pciephy_ctrl_71,
dec_pciephy_ctrl_72,
dec_pciephy_ctrl_73,
dec_pciephy_ctrl_74,
dec_pciephy_ctrl_75,
dec_pciephy_ctrl_76,
dec_pciephy_ctrl_77,
dec_pciephy_ctrl_78,
dec_pciephy_ctrl_79,
dec_pciephy_ctrl_80,
dec_pciephy_ctrl_81,
dec_pciephy_ctrl_82,
dec_pciephy_ctrl_83,
dec_pciephy_ctrl_84,
dec_pciephy_ctrl_85,
dec_pciephy_ctrl_86,
dec_pciephy_ctrl_87,
dec_pciephy_ctrl_88,
dec_pciephy_ctrl_89,
dec_pciephy_ctrl_90,
dec_pciephy_ctrl_91,
dec_pciephy_ctrl_92,
dec_pciephy_ctrl_93,
dec_pciephy_ctrl_94,
dec_pciephy_ctrl_95,
dec_pciephy_ctrl_96,
dec_pciephy_ctrl_97,
dec_pciephy_ctrl_98,
dec_pciephy_ctrl_99,
dec_pciephy_ctrl_100,
dec_pciephy_ctrl_101,
dec_pciephy_ctrl_102,
dec_pciephy_ctrl_103,
dec_pciephy_ctrl_104,
dec_pciephy_ctrl_105,
dec_pciephy_ctrl_106,
dec_pciephy_ctrl_107,
dec_pciephy_ctrl_108,
dec_pciephy_ctrl_109,
dec_pciephy_ctrl_110,
dec_pciephy_ctrl_111,
dec_pciephy_ctrl_112,
dec_pciephy_ctrl_113,
dec_pciephy_ctrl_114,
dec_pciephy_ctrl_115,
dec_pciephy_ctrl_116,
dec_pciephy_ctrl_117,
dec_pciephy_ctrl_118,
dec_pciephy_ctrl_119,
dec_pciephy_ctrl_120,
dec_pciephy_ctrl_121,
dec_pciephy_ctrl_122,
dec_pciephy_ctrl_123,
dec_pciephy_ctrl_124,
dec_pciephy_ctrl_125,
dec_pciephy_ctrl_126,
dec_pciephy_ctrl_127,
dec_pciephy_ctrl_128,
dec_pciephy_ctrl_129,
dec_pciephy_ctrl_130,
dec_pciephy_ctrl_131,
dec_pciephy_ctrl_132,
dec_pciephy_ctrl_133,
dec_pciephy_ctrl_134,
dec_pciephy_ctrl_135,
dec_pciephy_ctrl_136,
dec_pciephy_ctrl_137,
dec_pciephy_ctrl_138,
dec_pciephy_ctrl_139,
dec_pciephy_ctrl_140,
dec_pciephy_ctrl_141,
dec_pciephy_ctrl_142,
dec_pciephy_ctrl_143,
dec_pciephy_ctrl_144,
dec_pciephy_ctrl_145,
dec_pciephy_ctrl_146,
dec_pciephy_ctrl_147,
dec_pciephy_ctrl_148,
dec_pciephy_ctrl_149,
dec_pciephy_ctrl_150,
dec_pciephy_ctrl_151,
dec_pciephy_ctrl_152,
dec_pciephy_ctrl_153,
dec_pciephy_ctrl_154,
dec_pciephy_ctrl_155,
dec_pciephy_ctrl_156,
dec_pciephy_ctrl_157,
dec_pciephy_ctrl_158,
dec_pciephy_ctrl_159,
dec_pciephy_ctrl_160,
dec_pciephy_ctrl_161,
dec_pciephy_ctrl_162,
dec_pciephy_ctrl_163,
dec_pciephy_ctrl_164,
dec_pciephy_ctrl_165,
dec_pciephy_ctrl_166,
dec_pciephy_ctrl_167,
dec_pciephy_ctrl_168,
dec_pciephy_ctrl_169,
dec_pciephy_ctrl_170,
dec_pciephy_ctrl_171,
dec_pciephy_ctrl_172,
dec_pciephy_ctrl_173,
dec_pciephy_ctrl_174,
dec_pciephy_ctrl_175,
dec_pciephy_ctrl_176,
dec_pciephy_ctrl_177,
dec_pciephy_ctrl_178,
dec_pciephy_ctrl_179,
dec_pciephy_ctrl_180,
dec_pciephy_ctrl_181,
dec_pciephy_ctrl_182,
dec_pciephy_ctrl_183,
dec_pciephy_ctrl_184,
dec_pciephy_ctrl_185,
dec_pciephy_ctrl_186,
dec_pciephy_ctrl_187,
dec_pciephy_ctrl_188,
dec_pciephy_ctrl_189,
dec_pciephy_ctrl_190,
dec_pciephy_ctrl_191,
dec_pciephy_ctrl_192,
dec_pciephy_ctrl_193,
dec_pciephy_ctrl_194,
dec_pciephy_ctrl_195,
dec_pciephy_ctrl_196,
dec_pciephy_ctrl_197,
dec_pciephy_ctrl_198,
dec_pciephy_ctrl_199,
dec_pciephy_ctrl_200,
dec_pciephy_ctrl_201,
dec_pciephy_ctrl_202,
dec_pciephy_ctrl_203,
dec_pciephy_ctrl_204,
dec_pciephy_ctrl_205,
dec_pciephy_ctrl_206,
dec_pciephy_ctrl_207,
dec_pciephy_ctrl_208,
dec_pciephy_ctrl_209,
dec_pciephy_ctrl_210,
dec_pciephy_ctrl_211,
dec_pciephy_ctrl_212,
dec_pciephy_ctrl_213,
dec_pciephy_ctrl_214,
dec_pciephy_ctrl_215,
dec_pciephy_ctrl_216,
dec_pciephy_ctrl_217,
dec_pciephy_ctrl_218,
dec_pciephy_ctrl_219,
dec_pciephy_ctrl_220,
dec_pciephy_ctrl_221,
dec_pciephy_ctrl_222,
dec_pciephy_ctrl_223,
dec_pciephy_ctrl_224,
dec_pciephy_ctrl_225,
dec_pciephy_ctrl_226,
dec_pciephy_ctrl_227,
dec_pciephy_ctrl_228,
dec_pciephy_ctrl_229,
dec_pciephy_ctrl_230,
dec_pciephy_ctrl_231,
dec_pciephy_ctrl_232,
dec_pciephy_ctrl_233,
dec_pciephy_ctrl_234,
dec_pciephy_ctrl_235,
dec_pciephy_ctrl_236,
dec_pciephy_ctrl_237,
dec_pciephy_ctrl_238,
dec_pciephy_ctrl_239,
dec_pciephy_ctrl_240,
dec_pciephy_ctrl_241,
dec_pciephy_ctrl_242,
dec_pciephy_ctrl_243,
dec_pciephy_ctrl_244,
dec_pciephy_ctrl_245,
dec_pciephy_ctrl_246,
dec_pciephy_ctrl_247,
dec_pciephy_ctrl_248,
dec_pciephy_ctrl_249,
dec_pciephy_ctrl_250,
dec_pciephy_ctrl_251,
dec_pciephy_ctrl_252,
dec_pciephy_ctrl_253,
dec_pciephy_ctrl_254,
dec_pciephy_ctrl_255,
dec_pciephy_ctrl_256,
dec_pciephy_ctrl_257,
dec_pciephy_ctrl_258,
dec_pciephy_ctrl_259,
dec_pciephy_ctrl_260,
dec_pciephy_ctrl_261,
dec_pciephy_ctrl_262,
dec_pciephy_ctrl_263,
dec_pciephy_ctrl_264,
dec_pciephy_ctrl_265,
dec_pciephy_ctrl_266,
dec_pciephy_ctrl_267,
dec_pciephy_ctrl_268,
dec_pciephy_ctrl_269,
dec_pciephy_ctrl_270,
dec_pciephy_ctrl_271,
dec_pciephy_ctrl_272,
dec_pciephy_ctrl_273,
dec_pciephy_ctrl_274,
dec_pciephy_ctrl_275,
dec_pciephy_ctrl_276,
dec_pciephy_ctrl_277,
dec_pciephy_ctrl_278,
dec_pciephy_ctrl_279,
dec_pciephy_ctrl_280,
dec_pciephy_ctrl_281,
dec_pciephy_ctrl_282,
dec_pciephy_ctrl_283,
dec_pciephy_ctrl_284,
dec_pciephy_ctrl_285,
dec_pciephy_ctrl_286,
dec_pciephy_ctrl_287,
dec_pciephy_ctrl_288,
dec_pciephy_ctrl_289,
dec_pciephy_ctrl_290,
dec_pciephy_ctrl_291,
dec_pciephy_ctrl_292,
dec_pciephy_ctrl_293,
dec_pciephy_ctrl_294,
dec_pciephy_ctrl_295,
dec_pciephy_ctrl_296,
dec_pciephy_ctrl_297,
dec_pciephy_ctrl_298,
dec_pciephy_ctrl_299,
dec_pciephy_ctrl_300,
dec_pciephy_ctrl_301,
dec_pciephy_ctrl_302,
dec_pciephy_ctrl_303,
dec_pciephy_ctrl_304,
dec_pciephy_ctrl_305,
dec_pciephy_ctrl_306,
dec_pciephy_ctrl_307,
dec_pciephy_ctrl_308,
dec_pciephy_ctrl_309,
dec_pciephy_ctrl_310,
dec_pciephy_ctrl_311,
dec_pciephy_ctrl_312,
dec_pciephy_ctrl_313,
dec_pciephy_ctrl_314,
dec_pciephy_ctrl_315,
dec_pciephy_ctrl_316,
dec_pciephy_ctrl_317,
dec_pciephy_ctrl_318,
dec_pciephy_ctrl_319,
dec_pciephy_ctrl_320,
dec_pciephy_ctrl_321,
dec_pciephy_ctrl_322,
dec_pciephy_ctrl_323,
dec_pciephy_ctrl_324,
dec_pciephy_ctrl_325,
dec_pciephy_ctrl_326,
dec_pciephy_ctrl_327,
dec_pciephy_ctrl_328,
dec_pciephy_ctrl_329,
dec_pciephy_ctrl_330,
dec_pciephy_ctrl_331,
dec_pciephy_ctrl_332,
dec_pciephy_ctrl_333,
dec_pciephy_ctrl_334,
dec_pciephy_ctrl_335,
dec_pciephy_ctrl_336,
dec_pciephy_ctrl_337,
dec_pciephy_ctrl_338,
dec_pciephy_ctrl_339,
dec_pciephy_ctrl_340,
dec_pciephy_ctrl_341,
dec_pciephy_ctrl_342,
dec_pciephy_ctrl_343,
dec_pciephy_ctrl_344,
dec_pciephy_ctrl_345,
dec_pciephy_ctrl_346,
dec_pciephy_ctrl_347,
dec_pciephy_ctrl_348,
dec_pciephy_ctrl_349,
dec_pciephy_ctrl_350,
dec_pciephy_ctrl_351,
dec_pciephy_ctrl_352,
dec_pciephy_ctrl_353,
dec_pciephy_ctrl_354,
dec_pciephy_ctrl_355,
dec_pciephy_ctrl_356,
dec_pciephy_ctrl_357,
dec_pciephy_ctrl_358,
dec_pciephy_ctrl_359,
dec_pciephy_ctrl_360,
dec_pciephy_ctrl_361,
dec_pciephy_ctrl_362,
dec_pciephy_ctrl_363,
dec_pciephy_ctrl_364,
dec_pciephy_ctrl_365,
dec_pciephy_ctrl_366,
dec_pciephy_ctrl_367,
dec_pciephy_ctrl_368,
dec_pciephy_ctrl_369,
dec_pciephy_ctrl_370,
dec_pciephy_ctrl_371,
dec_pciephy_ctrl_372,
dec_pciephy_ctrl_373,
dec_pciephy_ctrl_374,
dec_pciephy_ctrl_375,
dec_pciephy_ctrl_376,
dec_pciephy_ctrl_377,
dec_pciephy_ctrl_378,
dec_pciephy_ctrl_379,
dec_pciephy_ctrl_380,
dec_pciephy_ctrl_381,
dec_pciephy_ctrl_382,
dec_pciephy_ctrl_383,
dec_pciephy_ctrl_384,
dec_pciephy_ctrl_385,
dec_pciephy_ctrl_386,
dec_pciephy_ctrl_387,
dec_pciephy_ctrl_388,
dec_pciephy_ctrl_389,
dec_pciephy_ctrl_390,
dec_pciephy_ctrl_391,
dec_pciephy_ctrl_392,
dec_pciephy_ctrl_393,
dec_pciephy_ctrl_394,
dec_pciephy_ctrl_395,
dec_pciephy_ctrl_396,
dec_pciephy_ctrl_397,
dec_pciephy_ctrl_398,
dec_pciephy_ctrl_399,
dec_pciephy_ctrl_400,
dec_pciephy_ctrl_401,
dec_pciephy_ctrl_402,
dec_pciephy_ctrl_403,
dec_pciephy_ctrl_404,
dec_pciephy_ctrl_405,
dec_pciephy_ctrl_406,
dec_pciephy_ctrl_407,
dec_pciephy_ctrl_408,
dec_pciephy_ctrl_409,
dec_pciephy_ctrl_410,
dec_pciephy_ctrl_411,
dec_pciephy_ctrl_412,
dec_pciephy_ctrl_413,
dec_pciephy_ctrl_414,
dec_pciephy_ctrl_415,
dec_pciephy_ctrl_416,
dec_pciephy_ctrl_417,
dec_pciephy_ctrl_418,
dec_pciephy_ctrl_419,
dec_pciephy_ctrl_420,
dec_pciephy_ctrl_421,
dec_pciephy_ctrl_422,
dec_pciephy_ctrl_423,
dec_pciephy_ctrl_424,
dec_pciephy_ctrl_425,
dec_pciephy_ctrl_426,
dec_pciephy_ctrl_427,
dec_pciephy_ctrl_428,
dec_pciephy_ctrl_429,
dec_pciephy_ctrl_430,
dec_pciephy_ctrl_431,
dec_pciephy_ctrl_432,
dec_pciephy_ctrl_433,
dec_pciephy_ctrl_434,
dec_pciephy_ctrl_435,
dec_pciephy_ctrl_436,
dec_pciephy_ctrl_437,
dec_pciephy_ctrl_438,
dec_pciephy_ctrl_439,
dec_pciephy_ctrl_440,
dec_pciephy_ctrl_441,
dec_pciephy_ctrl_442,
dec_pciephy_ctrl_443,
dec_pciephy_ctrl_444,
dec_pciephy_ctrl_445,
dec_pciephy_ctrl_446,
dec_pciephy_ctrl_447,
dec_pciephy_ctrl_448,
dec_pciephy_ctrl_449,
dec_pciephy_ctrl_450,
dec_pciephy_ctrl_451,
dec_pciephy_ctrl_452,
dec_pciephy_ctrl_453,
dec_pciephy_ctrl_454,
dec_pciephy_ctrl_455,
dec_pciephy_ctrl_456,
dec_pciephy_ctrl_457,
dec_pciephy_ctrl_458,
dec_pciephy_ctrl_459,
dec_pciephy_ctrl_460,
dec_pciephy_ctrl_461,
dec_pciephy_ctrl_462,
dec_pciephy_ctrl_463,
dec_pciephy_ctrl_464,
dec_pciephy_ctrl_465,
dec_pciephy_ctrl_466,
dec_pciephy_ctrl_467,
dec_pciephy_ctrl_468,
dec_pciephy_ctrl_469,
dec_pciephy_ctrl_470,
dec_pciephy_ctrl_471,
dec_pciephy_ctrl_472,
dec_pciephy_ctrl_473,
dec_pciephy_ctrl_474,
dec_pciephy_ctrl_475,
dec_pciephy_ctrl_476,
dec_pciephy_ctrl_477,
dec_pciephy_ctrl_478,
dec_pciephy_ctrl_479,
dec_pciephy_ctrl_480,
dec_pciephy_ctrl_481,
dec_pciephy_ctrl_482,
dec_pciephy_ctrl_483,
dec_pciephy_ctrl_484,
dec_pciephy_ctrl_485,
dec_pciephy_ctrl_486,
dec_pciephy_ctrl_487,
dec_pciephy_ctrl_488,
dec_pciephy_ctrl_489,
dec_pciephy_ctrl_490,
dec_pciephy_ctrl_491,
dec_pciephy_ctrl_492,
dec_pciephy_ctrl_493,
dec_pciephy_ctrl_494,
dec_pciephy_ctrl_495,
dec_pciephy_ctrl_496,
dec_pciephy_ctrl_497,
dec_pciephy_ctrl_498,
dec_pciephy_ctrl_499,
dec_pciephy_ctrl_500,
dec_pciephy_ctrl_501,
dec_pciephy_ctrl_502,
dec_pciephy_ctrl_503,
dec_pciephy_ctrl_504,
dec_pciephy_ctrl_505,
dec_pciephy_ctrl_506,
dec_pciephy_ctrl_507,
dec_pciephy_ctrl_508,
dec_pciephy_ctrl_509,
dec_pciephy_ctrl_510,
dec_pciephy_ctrl_511,
dec_pciephy_ctrl_512,
dec_pciephy_ctrl_513,
dec_pciephy_ctrl_514,
dec_pciephy_ctrl_515,
dec_pciephy_ctrl_516,
dec_pciephy_ctrl_517,
dec_pciephy_ctrl_518,
dec_pciephy_ctrl_519,
dec_pciephy_ctrl_520,
dec_pciephy_ctrl_521,
dec_pciephy_ctrl_522,
dec_pciephy_ctrl_523,
dec_pciephy_ctrl_524,
dec_pciephy_ctrl_525,
dec_pciephy_ctrl_526,
dec_pciephy_ctrl_527,
dec_pciephy_ctrl_528,
dec_pciephy_ctrl_529,
dec_pciephy_ctrl_530,
dec_pciephy_ctrl_531,
dec_pciephy_ctrl_532,
dec_pciephy_ctrl_533,
dec_pciephy_ctrl_534,
dec_pciephy_ctrl_535,
dec_pciephy_ctrl_536,
dec_pciephy_ctrl_537,
dec_pciephy_ctrl_538,
dec_pciephy_ctrl_539,
dec_pciephy_ctrl_540,
dec_pciephy_ctrl_541,
dec_pciephy_ctrl_542,
dec_pciephy_ctrl_543,
dec_pciephy_ctrl_544,
dec_pciephy_ctrl_545,
dec_pciephy_ctrl_546,
dec_pciephy_ctrl_547,
dec_pciephy_ctrl_548,
dec_pciephy_ctrl_549,
dec_pciephy_ctrl_550,
dec_pciephy_ctrl_551,
dec_pciephy_ctrl_552,
dec_pciephy_ctrl_553,
dec_pciephy_ctrl_554,
dec_pciephy_ctrl_555,
dec_pciephy_ctrl_556,
dec_pciephy_ctrl_557,
dec_pciephy_ctrl_558,
dec_pciephy_ctrl_559,
dec_pciephy_ctrl_560,
dec_pciephy_ctrl_561,
dec_pciephy_ctrl_562,
dec_pciephy_ctrl_563,
dec_pciephy_ctrl_564,
dec_pciephy_ctrl_565,
dec_pciephy_ctrl_566,
dec_pciephy_ctrl_567,
dec_pciephy_ctrl_568,
dec_pciephy_ctrl_569,
dec_pciephy_ctrl_570,
dec_pciephy_ctrl_571,
dec_pciephy_ctrl_572,
dec_pciephy_ctrl_573,
dec_pciephy_ctrl_574,
dec_pciephy_ctrl_575,
dec_pciephy_ctrl_576,
dec_pciephy_ctrl_577,
dec_pciephy_ctrl_578,
dec_pciephy_ctrl_579,
dec_pciephy_ctrl_580,
dec_pciephy_ctrl_581,
dec_pciephy_ctrl_582,
dec_pciephy_ctrl_583,
dec_pciephy_ctrl_584,
dec_pciephy_ctrl_585,
dec_pciephy_ctrl_586,
dec_pciephy_ctrl_587,
dec_pciephy_ctrl_588,
dec_pciephy_ctrl_589};
// Read data mux
assign next_rdata =
( {32{dec_pciephy_ctrl_0}} & reg_pciephy_ctrl_0 ) |
( {32{dec_pciephy_ctrl_1}} & reg_pciephy_ctrl_1 ) |
( {32{dec_pciephy_ctrl_2}} & reg_pciephy_ctrl_2 ) |
( {32{dec_pciephy_ctrl_3}} & reg_pciephy_ctrl_3 ) |
( {32{dec_pciephy_ctrl_4}} & reg_pciephy_ctrl_4 ) |
( {32{dec_pciephy_ctrl_5}} & reg_pciephy_ctrl_5 ) |
( {32{dec_pciephy_ctrl_6}} & reg_pciephy_ctrl_6 ) |
( {32{dec_pciephy_ctrl_7}} & reg_pciephy_ctrl_7 ) |
( {32{dec_pciephy_ctrl_8}} & reg_pciephy_ctrl_8 ) |
( {32{dec_pciephy_ctrl_9}} & reg_pciephy_ctrl_9 ) |
( {32{dec_pciephy_ctrl_10}} & reg_pciephy_ctrl_10 ) |
( {32{dec_pciephy_ctrl_11}} & reg_pciephy_ctrl_11 ) |
( {32{dec_pciephy_ctrl_12}} & reg_pciephy_ctrl_12 ) |
( {32{dec_pciephy_ctrl_13}} & reg_pciephy_ctrl_13 ) |
( {32{dec_pciephy_ctrl_14}} & reg_pciephy_ctrl_14 ) |
( {32{dec_pciephy_ctrl_15}} & reg_pciephy_ctrl_15 ) |
( {32{dec_pciephy_ctrl_16}} & reg_pciephy_ctrl_16 ) |
( {32{dec_pciephy_ctrl_17}} & reg_pciephy_ctrl_17 ) |
( {32{dec_pciephy_ctrl_18}} & reg_pciephy_ctrl_18 ) |
( {32{dec_pciephy_ctrl_19}} & reg_pciephy_ctrl_19 ) |
( {32{dec_pciephy_ctrl_20}} & reg_pciephy_ctrl_20 ) |
( {32{dec_pciephy_ctrl_21}} & reg_pciephy_ctrl_21 ) |
( {32{dec_pciephy_ctrl_22}} & reg_pciephy_ctrl_22 ) |
( {32{dec_pciephy_ctrl_23}} & reg_pciephy_ctrl_23 ) |
( {32{dec_pciephy_ctrl_24}} & reg_pciephy_ctrl_24 ) |
( {32{dec_pciephy_ctrl_25}} & reg_pciephy_ctrl_25 ) |
( {32{dec_pciephy_ctrl_26}} & reg_pciephy_ctrl_26 ) |
( {32{dec_pciephy_ctrl_27}} & reg_pciephy_ctrl_27 ) |
( {32{dec_pciephy_ctrl_28}} & reg_pciephy_ctrl_28 ) |
( {32{dec_pciephy_ctrl_29}} & reg_pciephy_ctrl_29 ) |
( {32{dec_pciephy_ctrl_30}} & reg_pciephy_ctrl_30 ) |
( {32{dec_pciephy_ctrl_31}} & reg_pciephy_ctrl_31 ) |
( {32{dec_pciephy_ctrl_32}} & reg_pciephy_ctrl_32 ) |
( {32{dec_pciephy_ctrl_33}} & reg_pciephy_ctrl_33 ) |
( {32{dec_pciephy_ctrl_34}} & reg_pciephy_ctrl_34 ) |
( {32{dec_pciephy_ctrl_35}} & reg_pciephy_ctrl_35 ) |
( {32{dec_pciephy_ctrl_36}} & reg_pciephy_ctrl_36 ) |
( {32{dec_pciephy_ctrl_37}} & reg_pciephy_ctrl_37 ) |
( {32{dec_pciephy_ctrl_38}} & reg_pciephy_ctrl_38 ) |
( {32{dec_pciephy_ctrl_39}} & reg_pciephy_ctrl_39 ) |
( {32{dec_pciephy_ctrl_40}} & reg_pciephy_ctrl_40 ) |
( {32{dec_pciephy_ctrl_41}} & reg_pciephy_ctrl_41 ) |
( {32{dec_pciephy_ctrl_42}} & reg_pciephy_ctrl_42 ) |
( {32{dec_pciephy_ctrl_43}} & reg_pciephy_ctrl_43 ) |
( {32{dec_pciephy_ctrl_44}} & reg_pciephy_ctrl_44 ) |
( {32{dec_pciephy_ctrl_45}} & reg_pciephy_ctrl_45 ) |
( {32{dec_pciephy_ctrl_46}} & reg_pciephy_ctrl_46 ) |
( {32{dec_pciephy_ctrl_47}} & reg_pciephy_ctrl_47 ) |
( {32{dec_pciephy_ctrl_48}} & reg_pciephy_ctrl_48 ) |
( {32{dec_pciephy_ctrl_49}} & reg_pciephy_ctrl_49 ) |
( {32{dec_pciephy_ctrl_50}} & reg_pciephy_ctrl_50 ) |
( {32{dec_pciephy_ctrl_51}} & reg_pciephy_ctrl_51 ) |
( {32{dec_pciephy_ctrl_52}} & reg_pciephy_ctrl_52 ) |
( {32{dec_pciephy_ctrl_53}} & reg_pciephy_ctrl_53 ) |
( {32{dec_pciephy_ctrl_54}} & reg_pciephy_ctrl_54 ) |
( {32{dec_pciephy_ctrl_55}} & reg_pciephy_ctrl_55 ) |
( {32{dec_pciephy_ctrl_56}} & reg_pciephy_ctrl_56 ) |
( {32{dec_pciephy_ctrl_57}} & reg_pciephy_ctrl_57 ) |
( {32{dec_pciephy_ctrl_58}} & reg_pciephy_ctrl_58 ) |
( {32{dec_pciephy_ctrl_59}} & reg_pciephy_ctrl_59 ) |
( {32{dec_pciephy_ctrl_60}} & reg_pciephy_ctrl_60 ) |
( {32{dec_pciephy_ctrl_61}} & reg_pciephy_ctrl_61 ) |
( {32{dec_pciephy_ctrl_62}} & reg_pciephy_ctrl_62 ) |
( {32{dec_pciephy_ctrl_63}} & reg_pciephy_ctrl_63 ) |
( {32{dec_pciephy_ctrl_64}} & reg_pciephy_ctrl_64 ) |
( {32{dec_pciephy_ctrl_65}} & reg_pciephy_ctrl_65 ) |
( {32{dec_pciephy_ctrl_66}} & reg_pciephy_ctrl_66 ) |
( {32{dec_pciephy_ctrl_67}} & reg_pciephy_ctrl_67 ) |
( {32{dec_pciephy_ctrl_68}} & reg_pciephy_ctrl_68 ) |
( {32{dec_pciephy_ctrl_69}} & reg_pciephy_ctrl_69 ) |
( {32{dec_pciephy_ctrl_70}} & reg_pciephy_ctrl_70 ) |
( {32{dec_pciephy_ctrl_71}} & reg_pciephy_ctrl_71 ) |
( {32{dec_pciephy_ctrl_72}} & reg_pciephy_ctrl_72 ) |
( {32{dec_pciephy_ctrl_73}} & reg_pciephy_ctrl_73 ) |
( {32{dec_pciephy_ctrl_74}} & reg_pciephy_ctrl_74 ) |
( {32{dec_pciephy_ctrl_75}} & reg_pciephy_ctrl_75 ) |
( {32{dec_pciephy_ctrl_76}} & reg_pciephy_ctrl_76 ) |
( {32{dec_pciephy_ctrl_77}} & reg_pciephy_ctrl_77 ) |
( {32{dec_pciephy_ctrl_78}} & reg_pciephy_ctrl_78 ) |
( {32{dec_pciephy_ctrl_79}} & reg_pciephy_ctrl_79 ) |
( {32{dec_pciephy_ctrl_80}} & reg_pciephy_ctrl_80 ) |
( {32{dec_pciephy_ctrl_81}} & reg_pciephy_ctrl_81 ) |
( {32{dec_pciephy_ctrl_82}} & reg_pciephy_ctrl_82 ) |
( {32{dec_pciephy_ctrl_83}} & reg_pciephy_ctrl_83 ) |
( {32{dec_pciephy_ctrl_84}} & reg_pciephy_ctrl_84 ) |
( {32{dec_pciephy_ctrl_85}} & reg_pciephy_ctrl_85 ) |
( {32{dec_pciephy_ctrl_86}} & reg_pciephy_ctrl_86 ) |
( {32{dec_pciephy_ctrl_87}} & reg_pciephy_ctrl_87 ) |
( {32{dec_pciephy_ctrl_88}} & reg_pciephy_ctrl_88 ) |
( {32{dec_pciephy_ctrl_89}} & reg_pciephy_ctrl_89 ) |
( {32{dec_pciephy_ctrl_90}} & reg_pciephy_ctrl_90 ) |
( {32{dec_pciephy_ctrl_91}} & reg_pciephy_ctrl_91 ) |
( {32{dec_pciephy_ctrl_92}} & reg_pciephy_ctrl_92 ) |
( {32{dec_pciephy_ctrl_93}} & reg_pciephy_ctrl_93 ) |
( {32{dec_pciephy_ctrl_94}} & reg_pciephy_ctrl_94 ) |
( {32{dec_pciephy_ctrl_95}} & reg_pciephy_ctrl_95 ) |
( {32{dec_pciephy_ctrl_96}} & reg_pciephy_ctrl_96 ) |
( {32{dec_pciephy_ctrl_97}} & reg_pciephy_ctrl_97 ) |
( {32{dec_pciephy_ctrl_98}} & reg_pciephy_ctrl_98 ) |
( {32{dec_pciephy_ctrl_99}} & reg_pciephy_ctrl_99 ) |
( {32{dec_pciephy_ctrl_100}} & reg_pciephy_ctrl_100 ) |
( {32{dec_pciephy_ctrl_101}} & reg_pciephy_ctrl_101 ) |
( {32{dec_pciephy_ctrl_102}} & reg_pciephy_ctrl_102 ) |
( {32{dec_pciephy_ctrl_103}} & reg_pciephy_ctrl_103 ) |
( {32{dec_pciephy_ctrl_104}} & reg_pciephy_ctrl_104 ) |
( {32{dec_pciephy_ctrl_105}} & reg_pciephy_ctrl_105 ) |
( {32{dec_pciephy_ctrl_106}} & reg_pciephy_ctrl_106 ) |
( {32{dec_pciephy_ctrl_107}} & reg_pciephy_ctrl_107 ) |
( {32{dec_pciephy_ctrl_108}} & reg_pciephy_ctrl_108 ) |
( {32{dec_pciephy_ctrl_109}} & reg_pciephy_ctrl_109 ) |
( {32{dec_pciephy_ctrl_110}} & reg_pciephy_ctrl_110 ) |
( {32{dec_pciephy_ctrl_111}} & reg_pciephy_ctrl_111 ) |
( {32{dec_pciephy_ctrl_112}} & reg_pciephy_ctrl_112 ) |
( {32{dec_pciephy_ctrl_113}} & reg_pciephy_ctrl_113 ) |
( {32{dec_pciephy_ctrl_114}} & reg_pciephy_ctrl_114 ) |
( {32{dec_pciephy_ctrl_115}} & reg_pciephy_ctrl_115 ) |
( {32{dec_pciephy_ctrl_116}} & reg_pciephy_ctrl_116 ) |
( {32{dec_pciephy_ctrl_117}} & reg_pciephy_ctrl_117 ) |
( {32{dec_pciephy_ctrl_118}} & reg_pciephy_ctrl_118 ) |
( {32{dec_pciephy_ctrl_119}} & reg_pciephy_ctrl_119 ) |
( {32{dec_pciephy_ctrl_120}} & reg_pciephy_ctrl_120 ) |
( {32{dec_pciephy_ctrl_121}} & reg_pciephy_ctrl_121 ) |
( {32{dec_pciephy_ctrl_122}} & reg_pciephy_ctrl_122 ) |
( {32{dec_pciephy_ctrl_123}} & reg_pciephy_ctrl_123 ) |
( {32{dec_pciephy_ctrl_124}} & reg_pciephy_ctrl_124 ) |
( {32{dec_pciephy_ctrl_125}} & reg_pciephy_ctrl_125 ) |
( {32{dec_pciephy_ctrl_126}} & reg_pciephy_ctrl_126 ) |
( {32{dec_pciephy_ctrl_127}} & reg_pciephy_ctrl_127 ) |
( {32{dec_pciephy_ctrl_128}} & reg_pciephy_ctrl_128 ) |
( {32{dec_pciephy_ctrl_129}} & reg_pciephy_ctrl_129 ) |
( {32{dec_pciephy_ctrl_130}} & reg_pciephy_ctrl_130 ) |
( {32{dec_pciephy_ctrl_131}} & reg_pciephy_ctrl_131 ) |
( {32{dec_pciephy_ctrl_132}} & reg_pciephy_ctrl_132 ) |
( {32{dec_pciephy_ctrl_133}} & reg_pciephy_ctrl_133 ) |
( {32{dec_pciephy_ctrl_134}} & reg_pciephy_ctrl_134 ) |
( {32{dec_pciephy_ctrl_135}} & reg_pciephy_ctrl_135 ) |
( {32{dec_pciephy_ctrl_136}} & reg_pciephy_ctrl_136 ) |
( {32{dec_pciephy_ctrl_137}} & reg_pciephy_ctrl_137 ) |
( {32{dec_pciephy_ctrl_138}} & reg_pciephy_ctrl_138 ) |
( {32{dec_pciephy_ctrl_139}} & reg_pciephy_ctrl_139 ) |
( {32{dec_pciephy_ctrl_140}} & reg_pciephy_ctrl_140 ) |
( {32{dec_pciephy_ctrl_141}} & reg_pciephy_ctrl_141 ) |
( {32{dec_pciephy_ctrl_142}} & reg_pciephy_ctrl_142 ) |
( {32{dec_pciephy_ctrl_143}} & reg_pciephy_ctrl_143 ) |
( {32{dec_pciephy_ctrl_144}} & reg_pciephy_ctrl_144 ) |
( {32{dec_pciephy_ctrl_145}} & reg_pciephy_ctrl_145 ) |
( {32{dec_pciephy_ctrl_146}} & reg_pciephy_ctrl_146 ) |
( {32{dec_pciephy_ctrl_147}} & reg_pciephy_ctrl_147 ) |
( {32{dec_pciephy_ctrl_148}} & reg_pciephy_ctrl_148 ) |
( {32{dec_pciephy_ctrl_149}} & reg_pciephy_ctrl_149 ) |
( {32{dec_pciephy_ctrl_150}} & reg_pciephy_ctrl_150 ) |
( {32{dec_pciephy_ctrl_151}} & reg_pciephy_ctrl_151 ) |
( {32{dec_pciephy_ctrl_152}} & reg_pciephy_ctrl_152 ) |
( {32{dec_pciephy_ctrl_153}} & reg_pciephy_ctrl_153 ) |
( {32{dec_pciephy_ctrl_154}} & reg_pciephy_ctrl_154 ) |
( {32{dec_pciephy_ctrl_155}} & reg_pciephy_ctrl_155 ) |
( {32{dec_pciephy_ctrl_156}} & reg_pciephy_ctrl_156 ) |
( {32{dec_pciephy_ctrl_157}} & reg_pciephy_ctrl_157 ) |
( {32{dec_pciephy_ctrl_158}} & reg_pciephy_ctrl_158 ) |
( {32{dec_pciephy_ctrl_159}} & reg_pciephy_ctrl_159 ) |
( {32{dec_pciephy_ctrl_160}} & reg_pciephy_ctrl_160 ) |
( {32{dec_pciephy_ctrl_161}} & reg_pciephy_ctrl_161 ) |
( {32{dec_pciephy_ctrl_162}} & reg_pciephy_ctrl_162 ) |
( {32{dec_pciephy_ctrl_163}} & reg_pciephy_ctrl_163 ) |
( {32{dec_pciephy_ctrl_164}} & reg_pciephy_ctrl_164 ) |
( {32{dec_pciephy_ctrl_165}} & reg_pciephy_ctrl_165 ) |
( {32{dec_pciephy_ctrl_166}} & reg_pciephy_ctrl_166 ) |
( {32{dec_pciephy_ctrl_167}} & reg_pciephy_ctrl_167 ) |
( {32{dec_pciephy_ctrl_168}} & reg_pciephy_ctrl_168 ) |
( {32{dec_pciephy_ctrl_169}} & reg_pciephy_ctrl_169 ) |
( {32{dec_pciephy_ctrl_170}} & reg_pciephy_ctrl_170 ) |
( {32{dec_pciephy_ctrl_171}} & reg_pciephy_ctrl_171 ) |
( {32{dec_pciephy_ctrl_172}} & reg_pciephy_ctrl_172 ) |
( {32{dec_pciephy_ctrl_173}} & reg_pciephy_ctrl_173 ) |
( {32{dec_pciephy_ctrl_174}} & reg_pciephy_ctrl_174 ) |
( {32{dec_pciephy_ctrl_175}} & reg_pciephy_ctrl_175 ) |
( {32{dec_pciephy_ctrl_176}} & reg_pciephy_ctrl_176 ) |
( {32{dec_pciephy_ctrl_177}} & reg_pciephy_ctrl_177 ) |
( {32{dec_pciephy_ctrl_178}} & reg_pciephy_ctrl_178 ) |
( {32{dec_pciephy_ctrl_179}} & reg_pciephy_ctrl_179 ) |
( {32{dec_pciephy_ctrl_180}} & reg_pciephy_ctrl_180 ) |
( {32{dec_pciephy_ctrl_181}} & reg_pciephy_ctrl_181 ) |
( {32{dec_pciephy_ctrl_182}} & reg_pciephy_ctrl_182 ) |
( {32{dec_pciephy_ctrl_183}} & reg_pciephy_ctrl_183 ) |
( {32{dec_pciephy_ctrl_184}} & reg_pciephy_ctrl_184 ) |
( {32{dec_pciephy_ctrl_185}} & reg_pciephy_ctrl_185 ) |
( {32{dec_pciephy_ctrl_186}} & reg_pciephy_ctrl_186 ) |
( {32{dec_pciephy_ctrl_187}} & reg_pciephy_ctrl_187 ) |
( {32{dec_pciephy_ctrl_188}} & reg_pciephy_ctrl_188 ) |
( {32{dec_pciephy_ctrl_189}} & reg_pciephy_ctrl_189 ) |
( {32{dec_pciephy_ctrl_190}} & reg_pciephy_ctrl_190 ) |
( {32{dec_pciephy_ctrl_191}} & reg_pciephy_ctrl_191 ) |
( {32{dec_pciephy_ctrl_192}} & reg_pciephy_ctrl_192 ) |
( {32{dec_pciephy_ctrl_193}} & reg_pciephy_ctrl_193 ) |
( {32{dec_pciephy_ctrl_194}} & reg_pciephy_ctrl_194 ) |
( {32{dec_pciephy_ctrl_195}} & reg_pciephy_ctrl_195 ) |
( {32{dec_pciephy_ctrl_196}} & reg_pciephy_ctrl_196 ) |
( {32{dec_pciephy_ctrl_197}} & reg_pciephy_ctrl_197 ) |
( {32{dec_pciephy_ctrl_198}} & reg_pciephy_ctrl_198 ) |
( {32{dec_pciephy_ctrl_199}} & reg_pciephy_ctrl_199 ) |
( {32{dec_pciephy_ctrl_200}} & reg_pciephy_ctrl_200 ) |
( {32{dec_pciephy_ctrl_201}} & reg_pciephy_ctrl_201 ) |
( {32{dec_pciephy_ctrl_202}} & reg_pciephy_ctrl_202 ) |
( {32{dec_pciephy_ctrl_203}} & reg_pciephy_ctrl_203 ) |
( {32{dec_pciephy_ctrl_204}} & reg_pciephy_ctrl_204 ) |
( {32{dec_pciephy_ctrl_205}} & reg_pciephy_ctrl_205 ) |
( {32{dec_pciephy_ctrl_206}} & reg_pciephy_ctrl_206 ) |
( {32{dec_pciephy_ctrl_207}} & reg_pciephy_ctrl_207 ) |
( {32{dec_pciephy_ctrl_208}} & reg_pciephy_ctrl_208 ) |
( {32{dec_pciephy_ctrl_209}} & reg_pciephy_ctrl_209 ) |
( {32{dec_pciephy_ctrl_210}} & reg_pciephy_ctrl_210 ) |
( {32{dec_pciephy_ctrl_211}} & reg_pciephy_ctrl_211 ) |
( {32{dec_pciephy_ctrl_212}} & reg_pciephy_ctrl_212 ) |
( {32{dec_pciephy_ctrl_213}} & reg_pciephy_ctrl_213 ) |
( {32{dec_pciephy_ctrl_214}} & reg_pciephy_ctrl_214 ) |
( {32{dec_pciephy_ctrl_215}} & reg_pciephy_ctrl_215 ) |
( {32{dec_pciephy_ctrl_216}} & reg_pciephy_ctrl_216 ) |
( {32{dec_pciephy_ctrl_217}} & reg_pciephy_ctrl_217 ) |
( {32{dec_pciephy_ctrl_218}} & reg_pciephy_ctrl_218 ) |
( {32{dec_pciephy_ctrl_219}} & reg_pciephy_ctrl_219 ) |
( {32{dec_pciephy_ctrl_220}} & reg_pciephy_ctrl_220 ) |
( {32{dec_pciephy_ctrl_221}} & reg_pciephy_ctrl_221 ) |
( {32{dec_pciephy_ctrl_222}} & reg_pciephy_ctrl_222 ) |
( {32{dec_pciephy_ctrl_223}} & reg_pciephy_ctrl_223 ) |
( {32{dec_pciephy_ctrl_224}} & reg_pciephy_ctrl_224 ) |
( {32{dec_pciephy_ctrl_225}} & reg_pciephy_ctrl_225 ) |
( {32{dec_pciephy_ctrl_226}} & reg_pciephy_ctrl_226 ) |
( {32{dec_pciephy_ctrl_227}} & reg_pciephy_ctrl_227 ) |
( {32{dec_pciephy_ctrl_228}} & reg_pciephy_ctrl_228 ) |
( {32{dec_pciephy_ctrl_229}} & reg_pciephy_ctrl_229 ) |
( {32{dec_pciephy_ctrl_230}} & reg_pciephy_ctrl_230 ) |
( {32{dec_pciephy_ctrl_231}} & reg_pciephy_ctrl_231 ) |
( {32{dec_pciephy_ctrl_232}} & reg_pciephy_ctrl_232 ) |
( {32{dec_pciephy_ctrl_233}} & reg_pciephy_ctrl_233 ) |
( {32{dec_pciephy_ctrl_234}} & reg_pciephy_ctrl_234 ) |
( {32{dec_pciephy_ctrl_235}} & reg_pciephy_ctrl_235 ) |
( {32{dec_pciephy_ctrl_236}} & reg_pciephy_ctrl_236 ) |
( {32{dec_pciephy_ctrl_237}} & reg_pciephy_ctrl_237 ) |
( {32{dec_pciephy_ctrl_238}} & reg_pciephy_ctrl_238 ) |
( {32{dec_pciephy_ctrl_239}} & reg_pciephy_ctrl_239 ) |
( {32{dec_pciephy_ctrl_240}} & reg_pciephy_ctrl_240 ) |
( {32{dec_pciephy_ctrl_241}} & reg_pciephy_ctrl_241 ) |
( {32{dec_pciephy_ctrl_242}} & reg_pciephy_ctrl_242 ) |
( {32{dec_pciephy_ctrl_243}} & reg_pciephy_ctrl_243 ) |
( {32{dec_pciephy_ctrl_244}} & reg_pciephy_ctrl_244 ) |
( {32{dec_pciephy_ctrl_245}} & reg_pciephy_ctrl_245 ) |
( {32{dec_pciephy_ctrl_246}} & reg_pciephy_ctrl_246 ) |
( {32{dec_pciephy_ctrl_247}} & reg_pciephy_ctrl_247 ) |
( {32{dec_pciephy_ctrl_248}} & reg_pciephy_ctrl_248 ) |
( {32{dec_pciephy_ctrl_249}} & reg_pciephy_ctrl_249 ) |
( {32{dec_pciephy_ctrl_250}} & reg_pciephy_ctrl_250 ) |
( {32{dec_pciephy_ctrl_251}} & reg_pciephy_ctrl_251 ) |
( {32{dec_pciephy_ctrl_252}} & reg_pciephy_ctrl_252 ) |
( {32{dec_pciephy_ctrl_253}} & reg_pciephy_ctrl_253 ) |
( {32{dec_pciephy_ctrl_254}} & reg_pciephy_ctrl_254 ) |
( {32{dec_pciephy_ctrl_255}} & reg_pciephy_ctrl_255 ) |
( {32{dec_pciephy_ctrl_256}} & reg_pciephy_ctrl_256 ) |
( {32{dec_pciephy_ctrl_257}} & reg_pciephy_ctrl_257 ) |
( {32{dec_pciephy_ctrl_258}} & reg_pciephy_ctrl_258 ) |
( {32{dec_pciephy_ctrl_259}} & reg_pciephy_ctrl_259 ) |
( {32{dec_pciephy_ctrl_260}} & reg_pciephy_ctrl_260 ) |
( {32{dec_pciephy_ctrl_261}} & reg_pciephy_ctrl_261 ) |
( {32{dec_pciephy_ctrl_262}} & reg_pciephy_ctrl_262 ) |
( {32{dec_pciephy_ctrl_263}} & reg_pciephy_ctrl_263 ) |
( {32{dec_pciephy_ctrl_264}} & reg_pciephy_ctrl_264 ) |
( {32{dec_pciephy_ctrl_265}} & reg_pciephy_ctrl_265 ) |
( {32{dec_pciephy_ctrl_266}} & reg_pciephy_ctrl_266 ) |
( {32{dec_pciephy_ctrl_267}} & reg_pciephy_ctrl_267 ) |
( {32{dec_pciephy_ctrl_268}} & reg_pciephy_ctrl_268 ) |
( {32{dec_pciephy_ctrl_269}} & reg_pciephy_ctrl_269 ) |
( {32{dec_pciephy_ctrl_270}} & reg_pciephy_ctrl_270 ) |
( {32{dec_pciephy_ctrl_271}} & reg_pciephy_ctrl_271 ) |
( {32{dec_pciephy_ctrl_272}} & reg_pciephy_ctrl_272 ) |
( {32{dec_pciephy_ctrl_273}} & reg_pciephy_ctrl_273 ) |
( {32{dec_pciephy_ctrl_274}} & reg_pciephy_ctrl_274 ) |
( {32{dec_pciephy_ctrl_275}} & reg_pciephy_ctrl_275 ) |
( {32{dec_pciephy_ctrl_276}} & reg_pciephy_ctrl_276 ) |
( {32{dec_pciephy_ctrl_277}} & reg_pciephy_ctrl_277 ) |
( {32{dec_pciephy_ctrl_278}} & reg_pciephy_ctrl_278 ) |
( {32{dec_pciephy_ctrl_279}} & reg_pciephy_ctrl_279 ) |
( {32{dec_pciephy_ctrl_280}} & reg_pciephy_ctrl_280 ) |
( {32{dec_pciephy_ctrl_281}} & reg_pciephy_ctrl_281 ) |
( {32{dec_pciephy_ctrl_282}} & reg_pciephy_ctrl_282 ) |
( {32{dec_pciephy_ctrl_283}} & reg_pciephy_ctrl_283 ) |
( {32{dec_pciephy_ctrl_284}} & reg_pciephy_ctrl_284 ) |
( {32{dec_pciephy_ctrl_285}} & reg_pciephy_ctrl_285 ) |
( {32{dec_pciephy_ctrl_286}} & reg_pciephy_ctrl_286 ) |
( {32{dec_pciephy_ctrl_287}} & reg_pciephy_ctrl_287 ) |
( {32{dec_pciephy_ctrl_288}} & reg_pciephy_ctrl_288 ) |
( {32{dec_pciephy_ctrl_289}} & reg_pciephy_ctrl_289 ) |
( {32{dec_pciephy_ctrl_290}} & reg_pciephy_ctrl_290 ) |
( {32{dec_pciephy_ctrl_291}} & reg_pciephy_ctrl_291 ) |
( {32{dec_pciephy_ctrl_292}} & reg_pciephy_ctrl_292 ) |
( {32{dec_pciephy_ctrl_293}} & reg_pciephy_ctrl_293 ) |
( {32{dec_pciephy_ctrl_294}} & reg_pciephy_ctrl_294 ) |
( {32{dec_pciephy_ctrl_295}} & reg_pciephy_ctrl_295 ) |
( {32{dec_pciephy_ctrl_296}} & reg_pciephy_ctrl_296 ) |
( {32{dec_pciephy_ctrl_297}} & reg_pciephy_ctrl_297 ) |
( {32{dec_pciephy_ctrl_298}} & reg_pciephy_ctrl_298 ) |
( {32{dec_pciephy_ctrl_299}} & reg_pciephy_ctrl_299 ) |
( {32{dec_pciephy_ctrl_300}} & reg_pciephy_ctrl_300 ) |
( {32{dec_pciephy_ctrl_301}} & reg_pciephy_ctrl_301 ) |
( {32{dec_pciephy_ctrl_302}} & reg_pciephy_ctrl_302 ) |
( {32{dec_pciephy_ctrl_303}} & reg_pciephy_ctrl_303 ) |
( {32{dec_pciephy_ctrl_304}} & reg_pciephy_ctrl_304 ) |
( {32{dec_pciephy_ctrl_305}} & reg_pciephy_ctrl_305 ) |
( {32{dec_pciephy_ctrl_306}} & reg_pciephy_ctrl_306 ) |
( {32{dec_pciephy_ctrl_307}} & reg_pciephy_ctrl_307 ) |
( {32{dec_pciephy_ctrl_308}} & reg_pciephy_ctrl_308 ) |
( {32{dec_pciephy_ctrl_309}} & reg_pciephy_ctrl_309 ) |
( {32{dec_pciephy_ctrl_310}} & reg_pciephy_ctrl_310 ) |
( {32{dec_pciephy_ctrl_311}} & reg_pciephy_ctrl_311 ) |
( {32{dec_pciephy_ctrl_312}} & reg_pciephy_ctrl_312 ) |
( {32{dec_pciephy_ctrl_313}} & reg_pciephy_ctrl_313 ) |
( {32{dec_pciephy_ctrl_314}} & reg_pciephy_ctrl_314 ) |
( {32{dec_pciephy_ctrl_315}} & reg_pciephy_ctrl_315 ) |
( {32{dec_pciephy_ctrl_316}} & reg_pciephy_ctrl_316 ) |
( {32{dec_pciephy_ctrl_317}} & reg_pciephy_ctrl_317 ) |
( {32{dec_pciephy_ctrl_318}} & reg_pciephy_ctrl_318 ) |
( {32{dec_pciephy_ctrl_319}} & reg_pciephy_ctrl_319 ) |
( {32{dec_pciephy_ctrl_320}} & reg_pciephy_ctrl_320 ) |
( {32{dec_pciephy_ctrl_321}} & reg_pciephy_ctrl_321 ) |
( {32{dec_pciephy_ctrl_322}} & reg_pciephy_ctrl_322 ) |
( {32{dec_pciephy_ctrl_323}} & reg_pciephy_ctrl_323 ) |
( {32{dec_pciephy_ctrl_324}} & reg_pciephy_ctrl_324 ) |
( {32{dec_pciephy_ctrl_325}} & reg_pciephy_ctrl_325 ) |
( {32{dec_pciephy_ctrl_326}} & reg_pciephy_ctrl_326 ) |
( {32{dec_pciephy_ctrl_327}} & reg_pciephy_ctrl_327 ) |
( {32{dec_pciephy_ctrl_328}} & reg_pciephy_ctrl_328 ) |
( {32{dec_pciephy_ctrl_329}} & reg_pciephy_ctrl_329 ) |
( {32{dec_pciephy_ctrl_330}} & reg_pciephy_ctrl_330 ) |
( {32{dec_pciephy_ctrl_331}} & reg_pciephy_ctrl_331 ) |
( {32{dec_pciephy_ctrl_332}} & reg_pciephy_ctrl_332 ) |
( {32{dec_pciephy_ctrl_333}} & reg_pciephy_ctrl_333 ) |
( {32{dec_pciephy_ctrl_334}} & reg_pciephy_ctrl_334 ) |
( {32{dec_pciephy_ctrl_335}} & reg_pciephy_ctrl_335 ) |
( {32{dec_pciephy_ctrl_336}} & reg_pciephy_ctrl_336 ) |
( {32{dec_pciephy_ctrl_337}} & reg_pciephy_ctrl_337 ) |
( {32{dec_pciephy_ctrl_338}} & reg_pciephy_ctrl_338 ) |
( {32{dec_pciephy_ctrl_339}} & reg_pciephy_ctrl_339 ) |
( {32{dec_pciephy_ctrl_340}} & reg_pciephy_ctrl_340 ) |
( {32{dec_pciephy_ctrl_341}} & reg_pciephy_ctrl_341 ) |
( {32{dec_pciephy_ctrl_342}} & reg_pciephy_ctrl_342 ) |
( {32{dec_pciephy_ctrl_343}} & reg_pciephy_ctrl_343 ) |
( {32{dec_pciephy_ctrl_344}} & reg_pciephy_ctrl_344 ) |
( {32{dec_pciephy_ctrl_345}} & reg_pciephy_ctrl_345 ) |
( {32{dec_pciephy_ctrl_346}} & reg_pciephy_ctrl_346 ) |
( {32{dec_pciephy_ctrl_347}} & reg_pciephy_ctrl_347 ) |
( {32{dec_pciephy_ctrl_348}} & reg_pciephy_ctrl_348 ) |
( {32{dec_pciephy_ctrl_349}} & reg_pciephy_ctrl_349 ) |
( {32{dec_pciephy_ctrl_350}} & reg_pciephy_ctrl_350 ) |
( {32{dec_pciephy_ctrl_351}} & reg_pciephy_ctrl_351 ) |
( {32{dec_pciephy_ctrl_352}} & reg_pciephy_ctrl_352 ) |
( {32{dec_pciephy_ctrl_353}} & reg_pciephy_ctrl_353 ) |
( {32{dec_pciephy_ctrl_354}} & reg_pciephy_ctrl_354 ) |
( {32{dec_pciephy_ctrl_355}} & reg_pciephy_ctrl_355 ) |
( {32{dec_pciephy_ctrl_356}} & reg_pciephy_ctrl_356 ) |
( {32{dec_pciephy_ctrl_357}} & reg_pciephy_ctrl_357 ) |
( {32{dec_pciephy_ctrl_358}} & reg_pciephy_ctrl_358 ) |
( {32{dec_pciephy_ctrl_359}} & reg_pciephy_ctrl_359 ) |
( {32{dec_pciephy_ctrl_360}} & reg_pciephy_ctrl_360 ) |
( {32{dec_pciephy_ctrl_361}} & reg_pciephy_ctrl_361 ) |
( {32{dec_pciephy_ctrl_362}} & reg_pciephy_ctrl_362 ) |
( {32{dec_pciephy_ctrl_363}} & reg_pciephy_ctrl_363 ) |
( {32{dec_pciephy_ctrl_364}} & reg_pciephy_ctrl_364 ) |
( {32{dec_pciephy_ctrl_365}} & reg_pciephy_ctrl_365 ) |
( {32{dec_pciephy_ctrl_366}} & reg_pciephy_ctrl_366 ) |
( {32{dec_pciephy_ctrl_367}} & reg_pciephy_ctrl_367 ) |
( {32{dec_pciephy_ctrl_368}} & reg_pciephy_ctrl_368 ) |
( {32{dec_pciephy_ctrl_369}} & reg_pciephy_ctrl_369 ) |
( {32{dec_pciephy_ctrl_370}} & reg_pciephy_ctrl_370 ) |
( {32{dec_pciephy_ctrl_371}} & reg_pciephy_ctrl_371 ) |
( {32{dec_pciephy_ctrl_372}} & reg_pciephy_ctrl_372 ) |
( {32{dec_pciephy_ctrl_373}} & reg_pciephy_ctrl_373 ) |
( {32{dec_pciephy_ctrl_374}} & reg_pciephy_ctrl_374 ) |
( {32{dec_pciephy_ctrl_375}} & reg_pciephy_ctrl_375 ) |
( {32{dec_pciephy_ctrl_376}} & reg_pciephy_ctrl_376 ) |
( {32{dec_pciephy_ctrl_377}} & reg_pciephy_ctrl_377 ) |
( {32{dec_pciephy_ctrl_378}} & reg_pciephy_ctrl_378 ) |
( {32{dec_pciephy_ctrl_379}} & reg_pciephy_ctrl_379 ) |
( {32{dec_pciephy_ctrl_380}} & reg_pciephy_ctrl_380 ) |
( {32{dec_pciephy_ctrl_381}} & reg_pciephy_ctrl_381 ) |
( {32{dec_pciephy_ctrl_382}} & reg_pciephy_ctrl_382 ) |
( {32{dec_pciephy_ctrl_383}} & reg_pciephy_ctrl_383 ) |
( {32{dec_pciephy_ctrl_384}} & reg_pciephy_ctrl_384 ) |
( {32{dec_pciephy_ctrl_385}} & reg_pciephy_ctrl_385 ) |
( {32{dec_pciephy_ctrl_386}} & reg_pciephy_ctrl_386 ) |
( {32{dec_pciephy_ctrl_387}} & reg_pciephy_ctrl_387 ) |
( {32{dec_pciephy_ctrl_388}} & reg_pciephy_ctrl_388 ) |
( {32{dec_pciephy_ctrl_389}} & reg_pciephy_ctrl_389 ) |
( {32{dec_pciephy_ctrl_390}} & reg_pciephy_ctrl_390 ) |
( {32{dec_pciephy_ctrl_391}} & reg_pciephy_ctrl_391 ) |
( {32{dec_pciephy_ctrl_392}} & reg_pciephy_ctrl_392 ) |
( {32{dec_pciephy_ctrl_393}} & reg_pciephy_ctrl_393 ) |
( {32{dec_pciephy_ctrl_394}} & reg_pciephy_ctrl_394 ) |
( {32{dec_pciephy_ctrl_395}} & reg_pciephy_ctrl_395 ) |
( {32{dec_pciephy_ctrl_396}} & reg_pciephy_ctrl_396 ) |
( {32{dec_pciephy_ctrl_397}} & reg_pciephy_ctrl_397 ) |
( {32{dec_pciephy_ctrl_398}} & reg_pciephy_ctrl_398 ) |
( {32{dec_pciephy_ctrl_399}} & reg_pciephy_ctrl_399 ) |
( {32{dec_pciephy_ctrl_400}} & reg_pciephy_ctrl_400 ) |
( {32{dec_pciephy_ctrl_401}} & reg_pciephy_ctrl_401 ) |
( {32{dec_pciephy_ctrl_402}} & reg_pciephy_ctrl_402 ) |
( {32{dec_pciephy_ctrl_403}} & reg_pciephy_ctrl_403 ) |
( {32{dec_pciephy_ctrl_404}} & reg_pciephy_ctrl_404 ) |
( {32{dec_pciephy_ctrl_405}} & reg_pciephy_ctrl_405 ) |
( {32{dec_pciephy_ctrl_406}} & reg_pciephy_ctrl_406 ) |
( {32{dec_pciephy_ctrl_407}} & reg_pciephy_ctrl_407 ) |
( {32{dec_pciephy_ctrl_408}} & reg_pciephy_ctrl_408 ) |
( {32{dec_pciephy_ctrl_409}} & reg_pciephy_ctrl_409 ) |
( {32{dec_pciephy_ctrl_410}} & reg_pciephy_ctrl_410 ) |
( {32{dec_pciephy_ctrl_411}} & reg_pciephy_ctrl_411 ) |
( {32{dec_pciephy_ctrl_412}} & reg_pciephy_ctrl_412 ) |
( {32{dec_pciephy_ctrl_413}} & reg_pciephy_ctrl_413 ) |
( {32{dec_pciephy_ctrl_414}} & reg_pciephy_ctrl_414 ) |
( {32{dec_pciephy_ctrl_415}} & reg_pciephy_ctrl_415 ) |
( {32{dec_pciephy_ctrl_416}} & reg_pciephy_ctrl_416 ) |
( {32{dec_pciephy_ctrl_417}} & reg_pciephy_ctrl_417 ) |
( {32{dec_pciephy_ctrl_418}} & reg_pciephy_ctrl_418 ) |
( {32{dec_pciephy_ctrl_419}} & reg_pciephy_ctrl_419 ) |
( {32{dec_pciephy_ctrl_420}} & reg_pciephy_ctrl_420 ) |
( {32{dec_pciephy_ctrl_421}} & reg_pciephy_ctrl_421 ) |
( {32{dec_pciephy_ctrl_422}} & reg_pciephy_ctrl_422 ) |
( {32{dec_pciephy_ctrl_423}} & reg_pciephy_ctrl_423 ) |
( {32{dec_pciephy_ctrl_424}} & reg_pciephy_ctrl_424 ) |
( {32{dec_pciephy_ctrl_425}} & reg_pciephy_ctrl_425 ) |
( {32{dec_pciephy_ctrl_426}} & reg_pciephy_ctrl_426 ) |
( {32{dec_pciephy_ctrl_427}} & reg_pciephy_ctrl_427 ) |
( {32{dec_pciephy_ctrl_428}} & reg_pciephy_ctrl_428 ) |
( {32{dec_pciephy_ctrl_429}} & reg_pciephy_ctrl_429 ) |
( {32{dec_pciephy_ctrl_430}} & reg_pciephy_ctrl_430 ) |
( {32{dec_pciephy_ctrl_431}} & reg_pciephy_ctrl_431 ) |
( {32{dec_pciephy_ctrl_432}} & reg_pciephy_ctrl_432 ) |
( {32{dec_pciephy_ctrl_433}} & reg_pciephy_ctrl_433 ) |
( {32{dec_pciephy_ctrl_434}} & reg_pciephy_ctrl_434 ) |
( {32{dec_pciephy_ctrl_435}} & reg_pciephy_ctrl_435 ) |
( {32{dec_pciephy_ctrl_436}} & reg_pciephy_ctrl_436 ) |
( {32{dec_pciephy_ctrl_437}} & reg_pciephy_ctrl_437 ) |
( {32{dec_pciephy_ctrl_438}} & reg_pciephy_ctrl_438 ) |
( {32{dec_pciephy_ctrl_439}} & reg_pciephy_ctrl_439 ) |
( {32{dec_pciephy_ctrl_440}} & reg_pciephy_ctrl_440 ) |
( {32{dec_pciephy_ctrl_441}} & reg_pciephy_ctrl_441 ) |
( {32{dec_pciephy_ctrl_442}} & reg_pciephy_ctrl_442 ) |
( {32{dec_pciephy_ctrl_443}} & reg_pciephy_ctrl_443 ) |
( {32{dec_pciephy_ctrl_444}} & reg_pciephy_ctrl_444 ) |
( {32{dec_pciephy_ctrl_445}} & reg_pciephy_ctrl_445 ) |
( {32{dec_pciephy_ctrl_446}} & reg_pciephy_ctrl_446 ) |
( {32{dec_pciephy_ctrl_447}} & reg_pciephy_ctrl_447 ) |
( {32{dec_pciephy_ctrl_448}} & reg_pciephy_ctrl_448 ) |
( {32{dec_pciephy_ctrl_449}} & reg_pciephy_ctrl_449 ) |
( {32{dec_pciephy_ctrl_450}} & reg_pciephy_ctrl_450 ) |
( {32{dec_pciephy_ctrl_451}} & reg_pciephy_ctrl_451 ) |
( {32{dec_pciephy_ctrl_452}} & reg_pciephy_ctrl_452 ) |
( {32{dec_pciephy_ctrl_453}} & reg_pciephy_ctrl_453 ) |
( {32{dec_pciephy_ctrl_454}} & reg_pciephy_ctrl_454 ) |
( {32{dec_pciephy_ctrl_455}} & reg_pciephy_ctrl_455 ) |
( {32{dec_pciephy_ctrl_456}} & reg_pciephy_ctrl_456 ) |
( {32{dec_pciephy_ctrl_457}} & reg_pciephy_ctrl_457 ) |
( {32{dec_pciephy_ctrl_458}} & reg_pciephy_ctrl_458 ) |
( {32{dec_pciephy_ctrl_459}} & reg_pciephy_ctrl_459 ) |
( {32{dec_pciephy_ctrl_460}} & reg_pciephy_ctrl_460 ) |
( {32{dec_pciephy_ctrl_461}} & reg_pciephy_ctrl_461 ) |
( {32{dec_pciephy_ctrl_462}} & reg_pciephy_ctrl_462 ) |
( {32{dec_pciephy_ctrl_463}} & reg_pciephy_ctrl_463 ) |
( {32{dec_pciephy_ctrl_464}} & reg_pciephy_ctrl_464 ) |
( {32{dec_pciephy_ctrl_465}} & reg_pciephy_ctrl_465 ) |
( {32{dec_pciephy_ctrl_466}} & reg_pciephy_ctrl_466 ) |
( {32{dec_pciephy_ctrl_467}} & reg_pciephy_ctrl_467 ) |
( {32{dec_pciephy_ctrl_468}} & reg_pciephy_ctrl_468 ) |
( {32{dec_pciephy_ctrl_469}} & reg_pciephy_ctrl_469 ) |
( {32{dec_pciephy_ctrl_470}} & reg_pciephy_ctrl_470 ) |
( {32{dec_pciephy_ctrl_471}} & reg_pciephy_ctrl_471 ) |
( {32{dec_pciephy_ctrl_472}} & reg_pciephy_ctrl_472 ) |
( {32{dec_pciephy_ctrl_473}} & reg_pciephy_ctrl_473 ) |
( {32{dec_pciephy_ctrl_474}} & reg_pciephy_ctrl_474 ) |
( {32{dec_pciephy_ctrl_475}} & reg_pciephy_ctrl_475 ) |
( {32{dec_pciephy_ctrl_476}} & reg_pciephy_ctrl_476 ) |
( {32{dec_pciephy_ctrl_477}} & reg_pciephy_ctrl_477 ) |
( {32{dec_pciephy_ctrl_478}} & reg_pciephy_ctrl_478 ) |
( {32{dec_pciephy_ctrl_479}} & reg_pciephy_ctrl_479 ) |
( {32{dec_pciephy_ctrl_480}} & reg_pciephy_ctrl_480 ) |
( {32{dec_pciephy_ctrl_481}} & reg_pciephy_ctrl_481 ) |
( {32{dec_pciephy_ctrl_482}} & reg_pciephy_ctrl_482 ) |
( {32{dec_pciephy_ctrl_483}} & reg_pciephy_ctrl_483 ) |
( {32{dec_pciephy_ctrl_484}} & reg_pciephy_ctrl_484 ) |
( {32{dec_pciephy_ctrl_485}} & reg_pciephy_ctrl_485 ) |
( {32{dec_pciephy_ctrl_486}} & reg_pciephy_ctrl_486 ) |
( {32{dec_pciephy_ctrl_487}} & reg_pciephy_ctrl_487 ) |
( {32{dec_pciephy_ctrl_488}} & reg_pciephy_ctrl_488 ) |
( {32{dec_pciephy_ctrl_489}} & reg_pciephy_ctrl_489 ) |
( {32{dec_pciephy_ctrl_490}} & reg_pciephy_ctrl_490 ) |
( {32{dec_pciephy_ctrl_491}} & reg_pciephy_ctrl_491 ) |
( {32{dec_pciephy_ctrl_492}} & reg_pciephy_ctrl_492 ) |
( {32{dec_pciephy_ctrl_493}} & reg_pciephy_ctrl_493 ) |
( {32{dec_pciephy_ctrl_494}} & reg_pciephy_ctrl_494 ) |
( {32{dec_pciephy_ctrl_495}} & reg_pciephy_ctrl_495 ) |
( {32{dec_pciephy_ctrl_496}} & reg_pciephy_ctrl_496 ) |
( {32{dec_pciephy_ctrl_497}} & reg_pciephy_ctrl_497 ) |
( {32{dec_pciephy_ctrl_498}} & reg_pciephy_ctrl_498 ) |
( {32{dec_pciephy_ctrl_499}} & reg_pciephy_ctrl_499 ) |
( {32{dec_pciephy_ctrl_500}} & reg_pciephy_ctrl_500 ) |
( {32{dec_pciephy_ctrl_501}} & reg_pciephy_ctrl_501 ) |
( {32{dec_pciephy_ctrl_502}} & reg_pciephy_ctrl_502 ) |
( {32{dec_pciephy_ctrl_503}} & reg_pciephy_ctrl_503 ) |
( {32{dec_pciephy_ctrl_504}} & reg_pciephy_ctrl_504 ) |
( {32{dec_pciephy_ctrl_505}} & reg_pciephy_ctrl_505 ) |
( {32{dec_pciephy_ctrl_506}} & reg_pciephy_ctrl_506 ) |
( {32{dec_pciephy_ctrl_507}} & reg_pciephy_ctrl_507 ) |
( {32{dec_pciephy_ctrl_508}} & reg_pciephy_ctrl_508 ) |
( {32{dec_pciephy_ctrl_509}} & reg_pciephy_ctrl_509 ) |
( {32{dec_pciephy_ctrl_510}} & reg_pciephy_ctrl_510 ) |
( {32{dec_pciephy_ctrl_511}} & reg_pciephy_ctrl_511 ) |
( {32{dec_pciephy_ctrl_512}} & reg_pciephy_ctrl_512 ) |
( {32{dec_pciephy_ctrl_513}} & reg_pciephy_ctrl_513 ) |
( {32{dec_pciephy_ctrl_514}} & reg_pciephy_ctrl_514 ) |
( {32{dec_pciephy_ctrl_515}} & reg_pciephy_ctrl_515 ) |
( {32{dec_pciephy_ctrl_516}} & reg_pciephy_ctrl_516 ) |
( {32{dec_pciephy_ctrl_517}} & reg_pciephy_ctrl_517 ) |
( {32{dec_pciephy_ctrl_518}} & reg_pciephy_ctrl_518 ) |
( {32{dec_pciephy_ctrl_519}} & reg_pciephy_ctrl_519 ) |
( {32{dec_pciephy_ctrl_520}} & reg_pciephy_ctrl_520 ) |
( {32{dec_pciephy_ctrl_521}} & reg_pciephy_ctrl_521 ) |
( {32{dec_pciephy_ctrl_522}} & reg_pciephy_ctrl_522 ) |
( {32{dec_pciephy_ctrl_523}} & reg_pciephy_ctrl_523 ) |
( {32{dec_pciephy_ctrl_524}} & reg_pciephy_ctrl_524 ) |
( {32{dec_pciephy_ctrl_525}} & reg_pciephy_ctrl_525 ) |
( {32{dec_pciephy_ctrl_526}} & reg_pciephy_ctrl_526 ) |
( {32{dec_pciephy_ctrl_527}} & reg_pciephy_ctrl_527 ) |
( {32{dec_pciephy_ctrl_528}} & reg_pciephy_ctrl_528 ) |
( {32{dec_pciephy_ctrl_529}} & reg_pciephy_ctrl_529 ) |
( {32{dec_pciephy_ctrl_530}} & reg_pciephy_ctrl_530 ) |
( {32{dec_pciephy_ctrl_531}} & reg_pciephy_ctrl_531 ) |
( {32{dec_pciephy_ctrl_532}} & reg_pciephy_ctrl_532 ) |
( {32{dec_pciephy_ctrl_533}} & reg_pciephy_ctrl_533 ) |
( {32{dec_pciephy_ctrl_534}} & reg_pciephy_ctrl_534 ) |
( {32{dec_pciephy_ctrl_535}} & reg_pciephy_ctrl_535 ) |
( {32{dec_pciephy_ctrl_536}} & reg_pciephy_ctrl_536 ) |
( {32{dec_pciephy_ctrl_537}} & reg_pciephy_ctrl_537 ) |
( {32{dec_pciephy_ctrl_538}} & reg_pciephy_ctrl_538 ) |
( {32{dec_pciephy_ctrl_539}} & reg_pciephy_ctrl_539 ) |
( {32{dec_pciephy_ctrl_540}} & reg_pciephy_ctrl_540 ) |
( {32{dec_pciephy_ctrl_541}} & reg_pciephy_ctrl_541 ) |
( {32{dec_pciephy_ctrl_542}} & reg_pciephy_ctrl_542 ) |
( {32{dec_pciephy_ctrl_543}} & reg_pciephy_ctrl_543 ) |
( {32{dec_pciephy_ctrl_544}} & reg_pciephy_ctrl_544 ) |
( {32{dec_pciephy_ctrl_545}} & reg_pciephy_ctrl_545 ) |
( {32{dec_pciephy_ctrl_546}} & reg_pciephy_ctrl_546 ) |
( {32{dec_pciephy_ctrl_547}} & reg_pciephy_ctrl_547 ) |
( {32{dec_pciephy_ctrl_548}} & reg_pciephy_ctrl_548 ) |
( {32{dec_pciephy_ctrl_549}} & reg_pciephy_ctrl_549 ) |
( {32{dec_pciephy_ctrl_550}} & reg_pciephy_ctrl_550 ) |
( {32{dec_pciephy_ctrl_551}} & reg_pciephy_ctrl_551 ) |
( {32{dec_pciephy_ctrl_552}} & reg_pciephy_ctrl_552 ) |
( {32{dec_pciephy_ctrl_553}} & reg_pciephy_ctrl_553 ) |
( {32{dec_pciephy_ctrl_554}} & reg_pciephy_ctrl_554 ) |
( {32{dec_pciephy_ctrl_555}} & reg_pciephy_ctrl_555 ) |
( {32{dec_pciephy_ctrl_556}} & reg_pciephy_ctrl_556 ) |
( {32{dec_pciephy_ctrl_557}} & reg_pciephy_ctrl_557 ) |
( {32{dec_pciephy_ctrl_558}} & reg_pciephy_ctrl_558 ) |
( {32{dec_pciephy_ctrl_559}} & reg_pciephy_ctrl_559 ) |
( {32{dec_pciephy_ctrl_560}} & reg_pciephy_ctrl_560 ) |
( {32{dec_pciephy_ctrl_561}} & reg_pciephy_ctrl_561 ) |
( {32{dec_pciephy_ctrl_562}} & reg_pciephy_ctrl_562 ) |
( {32{dec_pciephy_ctrl_563}} & reg_pciephy_ctrl_563 ) |
( {32{dec_pciephy_ctrl_564}} & reg_pciephy_ctrl_564 ) |
( {32{dec_pciephy_ctrl_565}} & reg_pciephy_ctrl_565 ) |
( {32{dec_pciephy_ctrl_566}} & reg_pciephy_ctrl_566 ) |
( {32{dec_pciephy_ctrl_567}} & reg_pciephy_ctrl_567 ) |
( {32{dec_pciephy_ctrl_568}} & reg_pciephy_ctrl_568 ) |
( {32{dec_pciephy_ctrl_569}} & reg_pciephy_ctrl_569 ) |
( {32{dec_pciephy_ctrl_570}} & reg_pciephy_ctrl_570 ) |
( {32{dec_pciephy_ctrl_571}} & reg_pciephy_ctrl_571 ) |
( {32{dec_pciephy_ctrl_572}} & reg_pciephy_ctrl_572 ) |
( {32{dec_pciephy_ctrl_573}} & reg_pciephy_ctrl_573 ) |
( {32{dec_pciephy_ctrl_574}} & reg_pciephy_ctrl_574 ) |
( {32{dec_pciephy_ctrl_575}} & reg_pciephy_ctrl_575 ) |
( {32{dec_pciephy_ctrl_576}} & reg_pciephy_ctrl_576 ) |
( {32{dec_pciephy_ctrl_577}} & reg_pciephy_ctrl_577 ) |
( {32{dec_pciephy_ctrl_578}} & reg_pciephy_ctrl_578 ) |
( {32{dec_pciephy_ctrl_579}} & reg_pciephy_ctrl_579 ) |
( {32{dec_pciephy_ctrl_580}} & reg_pciephy_ctrl_580 ) |
( {32{dec_pciephy_ctrl_581}} & reg_pciephy_ctrl_581 ) |
( {32{dec_pciephy_ctrl_582}} & reg_pciephy_ctrl_582 ) |
( {32{dec_pciephy_ctrl_583}} & reg_pciephy_ctrl_583 ) |
( {32{dec_pciephy_ctrl_584}} & reg_pciephy_ctrl_584 ) |
( {32{dec_pciephy_ctrl_585}} & reg_pciephy_ctrl_585 ) |
( {32{dec_pciephy_ctrl_586}} & reg_pciephy_ctrl_586 ) |
( {32{dec_pciephy_ctrl_587}} & reg_pciephy_ctrl_587 ) |
( {32{dec_pciephy_ctrl_588}} & reg_pciephy_ctrl_588 ) |
( {32{dec_pciephy_ctrl_589}} & reg_pciephy_ctrl_589 );





always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
pslverr <= 1'h0;
end
else
begin
pslverr <= slverr;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_0 <= 32'h0;
end
else if(pciephy_ctrl_0_we)
begin
reg_pciephy_ctrl_0 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_1 <= 32'hFFFF;
end
else if(pciephy_ctrl_1_we)
begin
reg_pciephy_ctrl_1 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_3 <= 32'h2111088;
end
else if(pciephy_ctrl_3_we)
begin
reg_pciephy_ctrl_3 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_4 <= 32'h3117C104;
end
else if(pciephy_ctrl_4_we)
begin
reg_pciephy_ctrl_4 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_5 <= 32'h1800000;
end
else if(pciephy_ctrl_5_we)
begin
reg_pciephy_ctrl_5 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_6 <= 32'h33;
end
else if(pciephy_ctrl_6_we)
begin
reg_pciephy_ctrl_6 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_7 <= 32'h3117C104;
end
else if(pciephy_ctrl_7_we)
begin
reg_pciephy_ctrl_7 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_8 <= 32'h1800000;
end
else if(pciephy_ctrl_8_we)
begin
reg_pciephy_ctrl_8 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_9 <= 32'h33;
end
else if(pciephy_ctrl_9_we)
begin
reg_pciephy_ctrl_9 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_10 <= 32'h3117C104;
end
else if(pciephy_ctrl_10_we)
begin
reg_pciephy_ctrl_10 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_11 <= 32'h1800000;
end
else if(pciephy_ctrl_11_we)
begin
reg_pciephy_ctrl_11 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_12 <= 32'h33;
end
else if(pciephy_ctrl_12_we)
begin
reg_pciephy_ctrl_12 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_13 <= 32'h3117C104;
end
else if(pciephy_ctrl_13_we)
begin
reg_pciephy_ctrl_13 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_14 <= 32'h1800000;
end
else if(pciephy_ctrl_14_we)
begin
reg_pciephy_ctrl_14 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_15 <= 32'h33;
end
else if(pciephy_ctrl_15_we)
begin
reg_pciephy_ctrl_15 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_16 <= 32'h18C6318C;
end
else if(pciephy_ctrl_16_we)
begin
reg_pciephy_ctrl_16 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_17 <= 32'h18C6318C;
end
else if(pciephy_ctrl_17_we)
begin
reg_pciephy_ctrl_17 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_18 <= 32'h116318C;
end
else if(pciephy_ctrl_18_we)
begin
reg_pciephy_ctrl_18 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_19 <= 32'h1;
end
else if(pciephy_ctrl_19_we)
begin
reg_pciephy_ctrl_19 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_20 <= 32'h0;
end
else if(pciephy_ctrl_20_we)
begin
reg_pciephy_ctrl_20 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_21 <= 32'h1;
end
else if(pciephy_ctrl_21_we)
begin
reg_pciephy_ctrl_21 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_22 <= 32'h0;
end
else if(pciephy_ctrl_22_we)
begin
reg_pciephy_ctrl_22 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_23 <= 32'h1;
end
else if(pciephy_ctrl_23_we)
begin
reg_pciephy_ctrl_23 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_24 <= 32'h0;
end
else if(pciephy_ctrl_24_we)
begin
reg_pciephy_ctrl_24 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_25 <= 32'h1;
end
else if(pciephy_ctrl_25_we)
begin
reg_pciephy_ctrl_25 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_26 <= 32'h0;
end
else if(pciephy_ctrl_26_we)
begin
reg_pciephy_ctrl_26 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_27 <= 32'h1;
end
else if(pciephy_ctrl_27_we)
begin
reg_pciephy_ctrl_27 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_28 <= 32'h0;
end
else if(pciephy_ctrl_28_we)
begin
reg_pciephy_ctrl_28 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_29 <= 32'h1;
end
else if(pciephy_ctrl_29_we)
begin
reg_pciephy_ctrl_29 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_30 <= 32'h0;
end
else if(pciephy_ctrl_30_we)
begin
reg_pciephy_ctrl_30 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_31 <= 32'h1;
end
else if(pciephy_ctrl_31_we)
begin
reg_pciephy_ctrl_31 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_32 <= 32'h0;
end
else if(pciephy_ctrl_32_we)
begin
reg_pciephy_ctrl_32 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_33 <= 32'h1;
end
else if(pciephy_ctrl_33_we)
begin
reg_pciephy_ctrl_33 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_34 <= 32'h0;
end
else if(pciephy_ctrl_34_we)
begin
reg_pciephy_ctrl_34 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_35 <= 32'h1;
end
else if(pciephy_ctrl_35_we)
begin
reg_pciephy_ctrl_35 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_36 <= 32'h0;
end
else if(pciephy_ctrl_36_we)
begin
reg_pciephy_ctrl_36 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_37 <= 32'h1;
end
else if(pciephy_ctrl_37_we)
begin
reg_pciephy_ctrl_37 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_38 <= 32'h0;
end
else if(pciephy_ctrl_38_we)
begin
reg_pciephy_ctrl_38 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_39 <= 32'h1;
end
else if(pciephy_ctrl_39_we)
begin
reg_pciephy_ctrl_39 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_40 <= 32'h0;
end
else if(pciephy_ctrl_40_we)
begin
reg_pciephy_ctrl_40 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_41 <= 32'h1;
end
else if(pciephy_ctrl_41_we)
begin
reg_pciephy_ctrl_41 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_42 <= 32'h0;
end
else if(pciephy_ctrl_42_we)
begin
reg_pciephy_ctrl_42 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_43 <= 32'h1;
end
else if(pciephy_ctrl_43_we)
begin
reg_pciephy_ctrl_43 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_44 <= 32'h0;
end
else if(pciephy_ctrl_44_we)
begin
reg_pciephy_ctrl_44 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_45 <= 32'h1;
end
else if(pciephy_ctrl_45_we)
begin
reg_pciephy_ctrl_45 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_46 <= 32'h0;
end
else if(pciephy_ctrl_46_we)
begin
reg_pciephy_ctrl_46 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_47 <= 32'h1;
end
else if(pciephy_ctrl_47_we)
begin
reg_pciephy_ctrl_47 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_48 <= 32'h0;
end
else if(pciephy_ctrl_48_we)
begin
reg_pciephy_ctrl_48 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_49 <= 32'h1;
end
else if(pciephy_ctrl_49_we)
begin
reg_pciephy_ctrl_49 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_50 <= 32'h0;
end
else if(pciephy_ctrl_50_we)
begin
reg_pciephy_ctrl_50 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_51 <= 32'h0;
end
else if(pciephy_ctrl_51_we)
begin
reg_pciephy_ctrl_51 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_52 <= 32'h0;
end
else if(pciephy_ctrl_52_we)
begin
reg_pciephy_ctrl_52 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_53 <= 32'h0;
end
else if(pciephy_ctrl_53_we)
begin
reg_pciephy_ctrl_53 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_54 <= 32'h0;
end
else if(pciephy_ctrl_54_we)
begin
reg_pciephy_ctrl_54 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_55 <= 32'h0;
end
else if(pciephy_ctrl_55_we)
begin
reg_pciephy_ctrl_55 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_56 <= 32'h0;
end
else if(pciephy_ctrl_56_we)
begin
reg_pciephy_ctrl_56 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_57 <= 32'h0;
end
else if(pciephy_ctrl_57_we)
begin
reg_pciephy_ctrl_57 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_58 <= 32'h0;
end
else if(pciephy_ctrl_58_we)
begin
reg_pciephy_ctrl_58 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_59 <= 32'h0;
end
else if(pciephy_ctrl_59_we)
begin
reg_pciephy_ctrl_59 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_60 <= 32'h0;
end
else if(pciephy_ctrl_60_we)
begin
reg_pciephy_ctrl_60 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_61 <= 32'h0;
end
else if(pciephy_ctrl_61_we)
begin
reg_pciephy_ctrl_61 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_62 <= 32'h0;
end
else if(pciephy_ctrl_62_we)
begin
reg_pciephy_ctrl_62 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_63 <= 32'h0;
end
else if(pciephy_ctrl_63_we)
begin
reg_pciephy_ctrl_63 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_64 <= 32'h0;
end
else if(pciephy_ctrl_64_we)
begin
reg_pciephy_ctrl_64 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_65 <= 32'h0;
end
else if(pciephy_ctrl_65_we)
begin
reg_pciephy_ctrl_65 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_66 <= 32'h0;
end
else if(pciephy_ctrl_66_we)
begin
reg_pciephy_ctrl_66 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_67 <= 32'h0;
end
else if(pciephy_ctrl_67_we)
begin
reg_pciephy_ctrl_67 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_68 <= 32'h0;
end
else if(pciephy_ctrl_68_we)
begin
reg_pciephy_ctrl_68 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_69 <= 32'h0;
end
else if(pciephy_ctrl_69_we)
begin
reg_pciephy_ctrl_69 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_70 <= 32'h0;
end
else if(pciephy_ctrl_70_we)
begin
reg_pciephy_ctrl_70 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_71 <= 32'h0;
end
else if(pciephy_ctrl_71_we)
begin
reg_pciephy_ctrl_71 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_72 <= 32'h0;
end
else if(pciephy_ctrl_72_we)
begin
reg_pciephy_ctrl_72 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_73 <= 32'h0;
end
else if(pciephy_ctrl_73_we)
begin
reg_pciephy_ctrl_73 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_74 <= 32'h0;
end
else if(pciephy_ctrl_74_we)
begin
reg_pciephy_ctrl_74 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_75 <= 32'h0;
end
else if(pciephy_ctrl_75_we)
begin
reg_pciephy_ctrl_75 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_76 <= 32'h0;
end
else if(pciephy_ctrl_76_we)
begin
reg_pciephy_ctrl_76 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_77 <= 32'h0;
end
else if(pciephy_ctrl_77_we)
begin
reg_pciephy_ctrl_77 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_78 <= 32'h0;
end
else if(pciephy_ctrl_78_we)
begin
reg_pciephy_ctrl_78 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_79 <= 32'h0;
end
else if(pciephy_ctrl_79_we)
begin
reg_pciephy_ctrl_79 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_80 <= 32'h0;
end
else if(pciephy_ctrl_80_we)
begin
reg_pciephy_ctrl_80 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_81 <= 32'h0;
end
else if(pciephy_ctrl_81_we)
begin
reg_pciephy_ctrl_81 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_82 <= 32'h0;
end
else if(pciephy_ctrl_82_we)
begin
reg_pciephy_ctrl_82 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_83 <= 32'h0;
end
else if(pciephy_ctrl_83_we)
begin
reg_pciephy_ctrl_83 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_84 <= 32'h0;
end
else if(pciephy_ctrl_84_we)
begin
reg_pciephy_ctrl_84 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_85 <= 32'h0;
end
else if(pciephy_ctrl_85_we)
begin
reg_pciephy_ctrl_85 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_86 <= 32'h0;
end
else if(pciephy_ctrl_86_we)
begin
reg_pciephy_ctrl_86 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_87 <= 32'h0;
end
else if(pciephy_ctrl_87_we)
begin
reg_pciephy_ctrl_87 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_88 <= 32'h0;
end
else if(pciephy_ctrl_88_we)
begin
reg_pciephy_ctrl_88 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_89 <= 32'h0;
end
else if(pciephy_ctrl_89_we)
begin
reg_pciephy_ctrl_89 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_90 <= 32'h0;
end
else if(pciephy_ctrl_90_we)
begin
reg_pciephy_ctrl_90 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_91 <= 32'h1;
end
else if(pciephy_ctrl_91_we)
begin
reg_pciephy_ctrl_91 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_92 <= 32'h3E03E;
end
else if(pciephy_ctrl_92_we)
begin
reg_pciephy_ctrl_92 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_93 <= 32'h3E03E;
end
else if(pciephy_ctrl_93_we)
begin
reg_pciephy_ctrl_93 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_94 <= 32'h3E03E;
end
else if(pciephy_ctrl_94_we)
begin
reg_pciephy_ctrl_94 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_95 <= 32'h3E03E;
end
else if(pciephy_ctrl_95_we)
begin
reg_pciephy_ctrl_95 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_96 <= 32'h3E03E;
end
else if(pciephy_ctrl_96_we)
begin
reg_pciephy_ctrl_96 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_97 <= 32'h3E03E;
end
else if(pciephy_ctrl_97_we)
begin
reg_pciephy_ctrl_97 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_98 <= 32'h3E03E;
end
else if(pciephy_ctrl_98_we)
begin
reg_pciephy_ctrl_98 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_99 <= 32'h3E03E;
end
else if(pciephy_ctrl_99_we)
begin
reg_pciephy_ctrl_99 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_100 <= 32'h0;
end
else if(pciephy_ctrl_100_we)
begin
reg_pciephy_ctrl_100 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_101 <= 32'h0;
end
else if(pciephy_ctrl_101_we)
begin
reg_pciephy_ctrl_101 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_102 <= 32'h0;
end
else if(pciephy_ctrl_102_we)
begin
reg_pciephy_ctrl_102 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_103 <= 32'h0;
end
else if(pciephy_ctrl_103_we)
begin
reg_pciephy_ctrl_103 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_104 <= 32'h0;
end
else if(pciephy_ctrl_104_we)
begin
reg_pciephy_ctrl_104 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_105 <= 32'h21400;
end
else if(pciephy_ctrl_105_we)
begin
reg_pciephy_ctrl_105 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_106 <= 32'h0;
end
else if(pciephy_ctrl_106_we)
begin
reg_pciephy_ctrl_106 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_107 <= 32'h0;
end
else if(pciephy_ctrl_107_we)
begin
reg_pciephy_ctrl_107 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_108 <= 32'h0;
end
else if(pciephy_ctrl_108_we)
begin
reg_pciephy_ctrl_108 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_109 <= 32'h0;
end
else if(pciephy_ctrl_109_we)
begin
reg_pciephy_ctrl_109 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_110 <= 32'h0;
end
else if(pciephy_ctrl_110_we)
begin
reg_pciephy_ctrl_110 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_111 <= 32'h0;
end
else if(pciephy_ctrl_111_we)
begin
reg_pciephy_ctrl_111 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_112 <= 32'h0;
end
else if(pciephy_ctrl_112_we)
begin
reg_pciephy_ctrl_112 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_113 <= 32'h0;
end
else if(pciephy_ctrl_113_we)
begin
reg_pciephy_ctrl_113 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_114 <= 32'h0;
end
else if(pciephy_ctrl_114_we)
begin
reg_pciephy_ctrl_114 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_115 <= 32'h0;
end
else if(pciephy_ctrl_115_we)
begin
reg_pciephy_ctrl_115 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_116 <= 32'h0;
end
else if(pciephy_ctrl_116_we)
begin
reg_pciephy_ctrl_116 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_117 <= 32'h0;
end
else if(pciephy_ctrl_117_we)
begin
reg_pciephy_ctrl_117 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_118 <= 32'h0;
end
else if(pciephy_ctrl_118_we)
begin
reg_pciephy_ctrl_118 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_119 <= 32'h0;
end
else if(pciephy_ctrl_119_we)
begin
reg_pciephy_ctrl_119 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_120 <= 32'h0;
end
else if(pciephy_ctrl_120_we)
begin
reg_pciephy_ctrl_120 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_121 <= 32'h0;
end
else if(pciephy_ctrl_121_we)
begin
reg_pciephy_ctrl_121 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_122 <= 32'h0;
end
else if(pciephy_ctrl_122_we)
begin
reg_pciephy_ctrl_122 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_123 <= 32'h0;
end
else if(pciephy_ctrl_123_we)
begin
reg_pciephy_ctrl_123 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_124 <= 32'h0;
end
else if(pciephy_ctrl_124_we)
begin
reg_pciephy_ctrl_124 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_125 <= 32'h0;
end
else if(pciephy_ctrl_125_we)
begin
reg_pciephy_ctrl_125 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_126 <= 32'h0;
end
else if(pciephy_ctrl_126_we)
begin
reg_pciephy_ctrl_126 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_127 <= 32'h0;
end
else if(pciephy_ctrl_127_we)
begin
reg_pciephy_ctrl_127 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_128 <= 32'h0;
end
else if(pciephy_ctrl_128_we)
begin
reg_pciephy_ctrl_128 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_129 <= 32'h0;
end
else if(pciephy_ctrl_129_we)
begin
reg_pciephy_ctrl_129 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_130 <= 32'h0;
end
else if(pciephy_ctrl_130_we)
begin
reg_pciephy_ctrl_130 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_131 <= 32'h0;
end
else if(pciephy_ctrl_131_we)
begin
reg_pciephy_ctrl_131 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_132 <= 32'h0;
end
else if(pciephy_ctrl_132_we)
begin
reg_pciephy_ctrl_132 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_133 <= 32'h0;
end
else if(pciephy_ctrl_133_we)
begin
reg_pciephy_ctrl_133 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_134 <= 32'h0;
end
else if(pciephy_ctrl_134_we)
begin
reg_pciephy_ctrl_134 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_135 <= 32'h0;
end
else if(pciephy_ctrl_135_we)
begin
reg_pciephy_ctrl_135 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_136 <= 32'h0;
end
else if(pciephy_ctrl_136_we)
begin
reg_pciephy_ctrl_136 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_137 <= 32'h0;
end
else if(pciephy_ctrl_137_we)
begin
reg_pciephy_ctrl_137 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_138 <= 32'h0;
end
else if(pciephy_ctrl_138_we)
begin
reg_pciephy_ctrl_138 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_139 <= 32'h0;
end
else if(pciephy_ctrl_139_we)
begin
reg_pciephy_ctrl_139 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_140 <= 32'h0;
end
else if(pciephy_ctrl_140_we)
begin
reg_pciephy_ctrl_140 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_141 <= 32'h0;
end
else if(pciephy_ctrl_141_we)
begin
reg_pciephy_ctrl_141 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_142 <= 32'h0;
end
else if(pciephy_ctrl_142_we)
begin
reg_pciephy_ctrl_142 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_143 <= 32'h0;
end
else if(pciephy_ctrl_143_we)
begin
reg_pciephy_ctrl_143 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_144 <= 32'h0;
end
else if(pciephy_ctrl_144_we)
begin
reg_pciephy_ctrl_144 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_145 <= 32'h0;
end
else if(pciephy_ctrl_145_we)
begin
reg_pciephy_ctrl_145 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_146 <= 32'h0;
end
else if(pciephy_ctrl_146_we)
begin
reg_pciephy_ctrl_146 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_147 <= 32'h0;
end
else if(pciephy_ctrl_147_we)
begin
reg_pciephy_ctrl_147 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_148 <= 32'h0;
end
else if(pciephy_ctrl_148_we)
begin
reg_pciephy_ctrl_148 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_149 <= 32'h0;
end
else if(pciephy_ctrl_149_we)
begin
reg_pciephy_ctrl_149 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_150 <= 32'h0;
end
else if(pciephy_ctrl_150_we)
begin
reg_pciephy_ctrl_150 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_151 <= 32'h0;
end
else if(pciephy_ctrl_151_we)
begin
reg_pciephy_ctrl_151 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_152 <= 32'h0;
end
else if(pciephy_ctrl_152_we)
begin
reg_pciephy_ctrl_152 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_153 <= 32'h0;
end
else if(pciephy_ctrl_153_we)
begin
reg_pciephy_ctrl_153 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_154 <= 32'h0;
end
else if(pciephy_ctrl_154_we)
begin
reg_pciephy_ctrl_154 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_155 <= 32'h0;
end
else if(pciephy_ctrl_155_we)
begin
reg_pciephy_ctrl_155 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_156 <= 32'h0;
end
else if(pciephy_ctrl_156_we)
begin
reg_pciephy_ctrl_156 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_157 <= 32'h0;
end
else if(pciephy_ctrl_157_we)
begin
reg_pciephy_ctrl_157 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_158 <= 32'h0;
end
else if(pciephy_ctrl_158_we)
begin
reg_pciephy_ctrl_158 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_159 <= 32'h0;
end
else if(pciephy_ctrl_159_we)
begin
reg_pciephy_ctrl_159 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_160 <= 32'h0;
end
else if(pciephy_ctrl_160_we)
begin
reg_pciephy_ctrl_160 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_161 <= 32'h0;
end
else if(pciephy_ctrl_161_we)
begin
reg_pciephy_ctrl_161 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_162 <= 32'h0;
end
else if(pciephy_ctrl_162_we)
begin
reg_pciephy_ctrl_162 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_163 <= 32'h0;
end
else if(pciephy_ctrl_163_we)
begin
reg_pciephy_ctrl_163 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_164 <= 32'h0;
end
else if(pciephy_ctrl_164_we)
begin
reg_pciephy_ctrl_164 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_165 <= 32'h0;
end
else if(pciephy_ctrl_165_we)
begin
reg_pciephy_ctrl_165 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_166 <= 32'h0;
end
else if(pciephy_ctrl_166_we)
begin
reg_pciephy_ctrl_166 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_167 <= 32'h0;
end
else if(pciephy_ctrl_167_we)
begin
reg_pciephy_ctrl_167 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_168 <= 32'h0;
end
else if(pciephy_ctrl_168_we)
begin
reg_pciephy_ctrl_168 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_169 <= 32'h0;
end
else if(pciephy_ctrl_169_we)
begin
reg_pciephy_ctrl_169 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_170 <= 32'h0;
end
else if(pciephy_ctrl_170_we)
begin
reg_pciephy_ctrl_170 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_171 <= 32'h0;
end
else if(pciephy_ctrl_171_we)
begin
reg_pciephy_ctrl_171 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_172 <= 32'h0;
end
else if(pciephy_ctrl_172_we)
begin
reg_pciephy_ctrl_172 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_173 <= 32'h0;
end
else if(pciephy_ctrl_173_we)
begin
reg_pciephy_ctrl_173 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_174 <= 32'h0;
end
else if(pciephy_ctrl_174_we)
begin
reg_pciephy_ctrl_174 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_175 <= 32'h0;
end
else if(pciephy_ctrl_175_we)
begin
reg_pciephy_ctrl_175 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_176 <= 32'h0;
end
else if(pciephy_ctrl_176_we)
begin
reg_pciephy_ctrl_176 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_177 <= 32'h0;
end
else if(pciephy_ctrl_177_we)
begin
reg_pciephy_ctrl_177 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_178 <= 32'h0;
end
else if(pciephy_ctrl_178_we)
begin
reg_pciephy_ctrl_178 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_179 <= 32'h0;
end
else if(pciephy_ctrl_179_we)
begin
reg_pciephy_ctrl_179 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_180 <= 32'h0;
end
else if(pciephy_ctrl_180_we)
begin
reg_pciephy_ctrl_180 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_181 <= 32'h0;
end
else if(pciephy_ctrl_181_we)
begin
reg_pciephy_ctrl_181 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_182 <= 32'h0;
end
else if(pciephy_ctrl_182_we)
begin
reg_pciephy_ctrl_182 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_183 <= 32'h0;
end
else if(pciephy_ctrl_183_we)
begin
reg_pciephy_ctrl_183 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_184 <= 32'h0;
end
else if(pciephy_ctrl_184_we)
begin
reg_pciephy_ctrl_184 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_185 <= 32'h0;
end
else if(pciephy_ctrl_185_we)
begin
reg_pciephy_ctrl_185 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_186 <= 32'h0;
end
else if(pciephy_ctrl_186_we)
begin
reg_pciephy_ctrl_186 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_187 <= 32'h0;
end
else if(pciephy_ctrl_187_we)
begin
reg_pciephy_ctrl_187 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_188 <= 32'h0;
end
else if(pciephy_ctrl_188_we)
begin
reg_pciephy_ctrl_188 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_189 <= 32'h0;
end
else if(pciephy_ctrl_189_we)
begin
reg_pciephy_ctrl_189 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_190 <= 32'h0;
end
else if(pciephy_ctrl_190_we)
begin
reg_pciephy_ctrl_190 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_191 <= 32'h0;
end
else if(pciephy_ctrl_191_we)
begin
reg_pciephy_ctrl_191 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_192 <= 32'h0;
end
else if(pciephy_ctrl_192_we)
begin
reg_pciephy_ctrl_192 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_193 <= 32'h0;
end
else if(pciephy_ctrl_193_we)
begin
reg_pciephy_ctrl_193 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_194 <= 32'h0;
end
else if(pciephy_ctrl_194_we)
begin
reg_pciephy_ctrl_194 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_195 <= 32'h0;
end
else if(pciephy_ctrl_195_we)
begin
reg_pciephy_ctrl_195 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_196 <= 32'h0;
end
else if(pciephy_ctrl_196_we)
begin
reg_pciephy_ctrl_196 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_197 <= 32'h0;
end
else if(pciephy_ctrl_197_we)
begin
reg_pciephy_ctrl_197 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_198 <= 32'h0;
end
else if(pciephy_ctrl_198_we)
begin
reg_pciephy_ctrl_198 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_199 <= 32'h0;
end
else if(pciephy_ctrl_199_we)
begin
reg_pciephy_ctrl_199 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_200 <= 32'h0;
end
else if(pciephy_ctrl_200_we)
begin
reg_pciephy_ctrl_200 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_201 <= 32'h0;
end
else if(pciephy_ctrl_201_we)
begin
reg_pciephy_ctrl_201 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_202 <= 32'h0;
end
else if(pciephy_ctrl_202_we)
begin
reg_pciephy_ctrl_202 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_203 <= 32'h0;
end
else if(pciephy_ctrl_203_we)
begin
reg_pciephy_ctrl_203 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_204 <= 32'h0;
end
else if(pciephy_ctrl_204_we)
begin
reg_pciephy_ctrl_204 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_205 <= 32'h0;
end
else if(pciephy_ctrl_205_we)
begin
reg_pciephy_ctrl_205 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_206 <= 32'h0;
end
else if(pciephy_ctrl_206_we)
begin
reg_pciephy_ctrl_206 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_207 <= 32'h0;
end
else if(pciephy_ctrl_207_we)
begin
reg_pciephy_ctrl_207 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_208 <= 32'h0;
end
else if(pciephy_ctrl_208_we)
begin
reg_pciephy_ctrl_208 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_209 <= 32'h0;
end
else if(pciephy_ctrl_209_we)
begin
reg_pciephy_ctrl_209 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_210 <= 32'h0;
end
else if(pciephy_ctrl_210_we)
begin
reg_pciephy_ctrl_210 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_211 <= 32'h0;
end
else if(pciephy_ctrl_211_we)
begin
reg_pciephy_ctrl_211 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_212 <= 32'h0;
end
else if(pciephy_ctrl_212_we)
begin
reg_pciephy_ctrl_212 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_213 <= 32'h0;
end
else if(pciephy_ctrl_213_we)
begin
reg_pciephy_ctrl_213 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_214 <= 32'h0;
end
else if(pciephy_ctrl_214_we)
begin
reg_pciephy_ctrl_214 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_215 <= 32'h0;
end
else if(pciephy_ctrl_215_we)
begin
reg_pciephy_ctrl_215 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_216 <= 32'h0;
end
else if(pciephy_ctrl_216_we)
begin
reg_pciephy_ctrl_216 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_217 <= 32'h0;
end
else if(pciephy_ctrl_217_we)
begin
reg_pciephy_ctrl_217 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_218 <= 32'h0;
end
else if(pciephy_ctrl_218_we)
begin
reg_pciephy_ctrl_218 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_219 <= 32'h0;
end
else if(pciephy_ctrl_219_we)
begin
reg_pciephy_ctrl_219 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_220 <= 32'h0;
end
else if(pciephy_ctrl_220_we)
begin
reg_pciephy_ctrl_220 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_221 <= 32'h0;
end
else if(pciephy_ctrl_221_we)
begin
reg_pciephy_ctrl_221 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_222 <= 32'h0;
end
else if(pciephy_ctrl_222_we)
begin
reg_pciephy_ctrl_222 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_223 <= 32'h0;
end
else if(pciephy_ctrl_223_we)
begin
reg_pciephy_ctrl_223 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_224 <= 32'h0;
end
else if(pciephy_ctrl_224_we)
begin
reg_pciephy_ctrl_224 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_225 <= 32'h0;
end
else if(pciephy_ctrl_225_we)
begin
reg_pciephy_ctrl_225 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_226 <= 32'h0;
end
else if(pciephy_ctrl_226_we)
begin
reg_pciephy_ctrl_226 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_227 <= 32'h0;
end
else if(pciephy_ctrl_227_we)
begin
reg_pciephy_ctrl_227 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_228 <= 32'h0;
end
else if(pciephy_ctrl_228_we)
begin
reg_pciephy_ctrl_228 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_229 <= 32'h0;
end
else if(pciephy_ctrl_229_we)
begin
reg_pciephy_ctrl_229 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_230 <= 32'h0;
end
else if(pciephy_ctrl_230_we)
begin
reg_pciephy_ctrl_230 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_231 <= 32'h0;
end
else if(pciephy_ctrl_231_we)
begin
reg_pciephy_ctrl_231 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_232 <= 32'h0;
end
else if(pciephy_ctrl_232_we)
begin
reg_pciephy_ctrl_232 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_233 <= 32'h0;
end
else if(pciephy_ctrl_233_we)
begin
reg_pciephy_ctrl_233 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_234 <= 32'h0;
end
else if(pciephy_ctrl_234_we)
begin
reg_pciephy_ctrl_234 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_235 <= 32'h0;
end
else if(pciephy_ctrl_235_we)
begin
reg_pciephy_ctrl_235 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_236 <= 32'h0;
end
else if(pciephy_ctrl_236_we)
begin
reg_pciephy_ctrl_236 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_237 <= 32'h0;
end
else if(pciephy_ctrl_237_we)
begin
reg_pciephy_ctrl_237 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_238 <= 32'h0;
end
else if(pciephy_ctrl_238_we)
begin
reg_pciephy_ctrl_238 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_239 <= 32'h0;
end
else if(pciephy_ctrl_239_we)
begin
reg_pciephy_ctrl_239 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_240 <= 32'h0;
end
else if(pciephy_ctrl_240_we)
begin
reg_pciephy_ctrl_240 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_241 <= 32'h0;
end
else if(pciephy_ctrl_241_we)
begin
reg_pciephy_ctrl_241 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_242 <= 32'h0;
end
else if(pciephy_ctrl_242_we)
begin
reg_pciephy_ctrl_242 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_243 <= 32'h0;
end
else if(pciephy_ctrl_243_we)
begin
reg_pciephy_ctrl_243 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_244 <= 32'h0;
end
else if(pciephy_ctrl_244_we)
begin
reg_pciephy_ctrl_244 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_245 <= 32'h0;
end
else if(pciephy_ctrl_245_we)
begin
reg_pciephy_ctrl_245 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_246 <= 32'h0;
end
else if(pciephy_ctrl_246_we)
begin
reg_pciephy_ctrl_246 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_247 <= 32'h0;
end
else if(pciephy_ctrl_247_we)
begin
reg_pciephy_ctrl_247 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_248 <= 32'h0;
end
else if(pciephy_ctrl_248_we)
begin
reg_pciephy_ctrl_248 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_249 <= 32'h0;
end
else if(pciephy_ctrl_249_we)
begin
reg_pciephy_ctrl_249 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_250 <= 32'h0;
end
else if(pciephy_ctrl_250_we)
begin
reg_pciephy_ctrl_250 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_251 <= 32'h0;
end
else if(pciephy_ctrl_251_we)
begin
reg_pciephy_ctrl_251 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_252 <= 32'h0;
end
else if(pciephy_ctrl_252_we)
begin
reg_pciephy_ctrl_252 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_253 <= 32'h0;
end
else if(pciephy_ctrl_253_we)
begin
reg_pciephy_ctrl_253 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_254 <= 32'h0;
end
else if(pciephy_ctrl_254_we)
begin
reg_pciephy_ctrl_254 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_255 <= 32'h0;
end
else if(pciephy_ctrl_255_we)
begin
reg_pciephy_ctrl_255 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_256 <= 32'h0;
end
else if(pciephy_ctrl_256_we)
begin
reg_pciephy_ctrl_256 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_257 <= 32'h0;
end
else if(pciephy_ctrl_257_we)
begin
reg_pciephy_ctrl_257 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_258 <= 32'h0;
end
else if(pciephy_ctrl_258_we)
begin
reg_pciephy_ctrl_258 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_259 <= 32'h0;
end
else if(pciephy_ctrl_259_we)
begin
reg_pciephy_ctrl_259 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_260 <= 32'h0;
end
else if(pciephy_ctrl_260_we)
begin
reg_pciephy_ctrl_260 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_261 <= 32'h0;
end
else if(pciephy_ctrl_261_we)
begin
reg_pciephy_ctrl_261 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_262 <= 32'h0;
end
else if(pciephy_ctrl_262_we)
begin
reg_pciephy_ctrl_262 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_263 <= 32'h0;
end
else if(pciephy_ctrl_263_we)
begin
reg_pciephy_ctrl_263 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_264 <= 32'h0;
end
else if(pciephy_ctrl_264_we)
begin
reg_pciephy_ctrl_264 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_265 <= 32'h0;
end
else if(pciephy_ctrl_265_we)
begin
reg_pciephy_ctrl_265 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_266 <= 32'h0;
end
else if(pciephy_ctrl_266_we)
begin
reg_pciephy_ctrl_266 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_267 <= 32'h0;
end
else if(pciephy_ctrl_267_we)
begin
reg_pciephy_ctrl_267 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_268 <= 32'h0;
end
else if(pciephy_ctrl_268_we)
begin
reg_pciephy_ctrl_268 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_269 <= 32'h0;
end
else if(pciephy_ctrl_269_we)
begin
reg_pciephy_ctrl_269 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_270 <= 32'h0;
end
else if(pciephy_ctrl_270_we)
begin
reg_pciephy_ctrl_270 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_271 <= 32'h0;
end
else if(pciephy_ctrl_271_we)
begin
reg_pciephy_ctrl_271 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_272 <= 32'h0;
end
else if(pciephy_ctrl_272_we)
begin
reg_pciephy_ctrl_272 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_273 <= 32'h0;
end
else if(pciephy_ctrl_273_we)
begin
reg_pciephy_ctrl_273 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_274 <= 32'h0;
end
else if(pciephy_ctrl_274_we)
begin
reg_pciephy_ctrl_274 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_275 <= 32'h0;
end
else if(pciephy_ctrl_275_we)
begin
reg_pciephy_ctrl_275 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_276 <= 32'h0;
end
else if(pciephy_ctrl_276_we)
begin
reg_pciephy_ctrl_276 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_277 <= 32'h0;
end
else if(pciephy_ctrl_277_we)
begin
reg_pciephy_ctrl_277 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_278 <= 32'h0;
end
else if(pciephy_ctrl_278_we)
begin
reg_pciephy_ctrl_278 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_279 <= 32'h0;
end
else if(pciephy_ctrl_279_we)
begin
reg_pciephy_ctrl_279 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_280 <= 32'h0;
end
else if(pciephy_ctrl_280_we)
begin
reg_pciephy_ctrl_280 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_281 <= 32'h0;
end
else if(pciephy_ctrl_281_we)
begin
reg_pciephy_ctrl_281 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_282 <= 32'h0;
end
else if(pciephy_ctrl_282_we)
begin
reg_pciephy_ctrl_282 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_283 <= 32'h0;
end
else if(pciephy_ctrl_283_we)
begin
reg_pciephy_ctrl_283 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_284 <= 32'h0;
end
else if(pciephy_ctrl_284_we)
begin
reg_pciephy_ctrl_284 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_285 <= 32'h0;
end
else if(pciephy_ctrl_285_we)
begin
reg_pciephy_ctrl_285 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_286 <= 32'h0;
end
else if(pciephy_ctrl_286_we)
begin
reg_pciephy_ctrl_286 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_287 <= 32'h0;
end
else if(pciephy_ctrl_287_we)
begin
reg_pciephy_ctrl_287 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_288 <= 32'h0;
end
else if(pciephy_ctrl_288_we)
begin
reg_pciephy_ctrl_288 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_289 <= 32'h0;
end
else if(pciephy_ctrl_289_we)
begin
reg_pciephy_ctrl_289 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_290 <= 32'h0;
end
else if(pciephy_ctrl_290_we)
begin
reg_pciephy_ctrl_290 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_291 <= 32'h0;
end
else if(pciephy_ctrl_291_we)
begin
reg_pciephy_ctrl_291 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_292 <= 32'h0;
end
else if(pciephy_ctrl_292_we)
begin
reg_pciephy_ctrl_292 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_293 <= 32'h0;
end
else if(pciephy_ctrl_293_we)
begin
reg_pciephy_ctrl_293 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_294 <= 32'h0;
end
else if(pciephy_ctrl_294_we)
begin
reg_pciephy_ctrl_294 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_295 <= 32'h0;
end
else if(pciephy_ctrl_295_we)
begin
reg_pciephy_ctrl_295 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_296 <= 32'h0;
end
else if(pciephy_ctrl_296_we)
begin
reg_pciephy_ctrl_296 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_297 <= 32'h0;
end
else if(pciephy_ctrl_297_we)
begin
reg_pciephy_ctrl_297 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_298 <= 32'h0;
end
else if(pciephy_ctrl_298_we)
begin
reg_pciephy_ctrl_298 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_299 <= 32'h0;
end
else if(pciephy_ctrl_299_we)
begin
reg_pciephy_ctrl_299 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_300 <= 32'h0;
end
else if(pciephy_ctrl_300_we)
begin
reg_pciephy_ctrl_300 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_301 <= 32'h0;
end
else if(pciephy_ctrl_301_we)
begin
reg_pciephy_ctrl_301 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_302 <= 32'h0;
end
else if(pciephy_ctrl_302_we)
begin
reg_pciephy_ctrl_302 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_303 <= 32'h0;
end
else if(pciephy_ctrl_303_we)
begin
reg_pciephy_ctrl_303 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_304 <= 32'h0;
end
else if(pciephy_ctrl_304_we)
begin
reg_pciephy_ctrl_304 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_305 <= 32'h0;
end
else if(pciephy_ctrl_305_we)
begin
reg_pciephy_ctrl_305 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_306 <= 32'h0;
end
else if(pciephy_ctrl_306_we)
begin
reg_pciephy_ctrl_306 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_307 <= 32'h0;
end
else if(pciephy_ctrl_307_we)
begin
reg_pciephy_ctrl_307 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_308 <= 32'h0;
end
else if(pciephy_ctrl_308_we)
begin
reg_pciephy_ctrl_308 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_309 <= 32'h0;
end
else if(pciephy_ctrl_309_we)
begin
reg_pciephy_ctrl_309 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_310 <= 32'h0;
end
else if(pciephy_ctrl_310_we)
begin
reg_pciephy_ctrl_310 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_311 <= 32'h0;
end
else if(pciephy_ctrl_311_we)
begin
reg_pciephy_ctrl_311 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_312 <= 32'h0;
end
else if(pciephy_ctrl_312_we)
begin
reg_pciephy_ctrl_312 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_313 <= 32'h0;
end
else if(pciephy_ctrl_313_we)
begin
reg_pciephy_ctrl_313 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_314 <= 32'h0;
end
else if(pciephy_ctrl_314_we)
begin
reg_pciephy_ctrl_314 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_315 <= 32'h0;
end
else if(pciephy_ctrl_315_we)
begin
reg_pciephy_ctrl_315 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_316 <= 32'h0;
end
else if(pciephy_ctrl_316_we)
begin
reg_pciephy_ctrl_316 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_317 <= 32'h0;
end
else if(pciephy_ctrl_317_we)
begin
reg_pciephy_ctrl_317 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_318 <= 32'h0;
end
else if(pciephy_ctrl_318_we)
begin
reg_pciephy_ctrl_318 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_319 <= 32'h0;
end
else if(pciephy_ctrl_319_we)
begin
reg_pciephy_ctrl_319 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_320 <= 32'h0;
end
else if(pciephy_ctrl_320_we)
begin
reg_pciephy_ctrl_320 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_321 <= 32'h0;
end
else if(pciephy_ctrl_321_we)
begin
reg_pciephy_ctrl_321 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_322 <= 32'h0;
end
else if(pciephy_ctrl_322_we)
begin
reg_pciephy_ctrl_322 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_323 <= 32'h0;
end
else if(pciephy_ctrl_323_we)
begin
reg_pciephy_ctrl_323 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_324 <= 32'h0;
end
else if(pciephy_ctrl_324_we)
begin
reg_pciephy_ctrl_324 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_325 <= 32'h0;
end
else if(pciephy_ctrl_325_we)
begin
reg_pciephy_ctrl_325 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_326 <= 32'h0;
end
else if(pciephy_ctrl_326_we)
begin
reg_pciephy_ctrl_326 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_327 <= 32'h0;
end
else if(pciephy_ctrl_327_we)
begin
reg_pciephy_ctrl_327 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_328 <= 32'h0;
end
else if(pciephy_ctrl_328_we)
begin
reg_pciephy_ctrl_328 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_329 <= 32'h0;
end
else if(pciephy_ctrl_329_we)
begin
reg_pciephy_ctrl_329 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_330 <= 32'h0;
end
else if(pciephy_ctrl_330_we)
begin
reg_pciephy_ctrl_330 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_331 <= 32'h0;
end
else if(pciephy_ctrl_331_we)
begin
reg_pciephy_ctrl_331 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_332 <= 32'h0;
end
else if(pciephy_ctrl_332_we)
begin
reg_pciephy_ctrl_332 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_333 <= 32'h0;
end
else if(pciephy_ctrl_333_we)
begin
reg_pciephy_ctrl_333 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_334 <= 32'h0;
end
else if(pciephy_ctrl_334_we)
begin
reg_pciephy_ctrl_334 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_335 <= 32'h0;
end
else if(pciephy_ctrl_335_we)
begin
reg_pciephy_ctrl_335 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_336 <= 32'h0;
end
else if(pciephy_ctrl_336_we)
begin
reg_pciephy_ctrl_336 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_337 <= 32'h0;
end
else if(pciephy_ctrl_337_we)
begin
reg_pciephy_ctrl_337 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_338 <= 32'h0;
end
else if(pciephy_ctrl_338_we)
begin
reg_pciephy_ctrl_338 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_339 <= 32'h0;
end
else if(pciephy_ctrl_339_we)
begin
reg_pciephy_ctrl_339 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_340 <= 32'h0;
end
else if(pciephy_ctrl_340_we)
begin
reg_pciephy_ctrl_340 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_341 <= 32'h0;
end
else if(pciephy_ctrl_341_we)
begin
reg_pciephy_ctrl_341 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_342 <= 32'h0;
end
else if(pciephy_ctrl_342_we)
begin
reg_pciephy_ctrl_342 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_343 <= 32'h0;
end
else if(pciephy_ctrl_343_we)
begin
reg_pciephy_ctrl_343 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_344 <= 32'h0;
end
else if(pciephy_ctrl_344_we)
begin
reg_pciephy_ctrl_344 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_345 <= 32'h0;
end
else if(pciephy_ctrl_345_we)
begin
reg_pciephy_ctrl_345 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_346 <= 32'h0;
end
else if(pciephy_ctrl_346_we)
begin
reg_pciephy_ctrl_346 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_347 <= 32'h0;
end
else if(pciephy_ctrl_347_we)
begin
reg_pciephy_ctrl_347 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_348 <= 32'h0;
end
else if(pciephy_ctrl_348_we)
begin
reg_pciephy_ctrl_348 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_349 <= 32'h0;
end
else if(pciephy_ctrl_349_we)
begin
reg_pciephy_ctrl_349 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_350 <= 32'h0;
end
else if(pciephy_ctrl_350_we)
begin
reg_pciephy_ctrl_350 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_351 <= 32'h0;
end
else if(pciephy_ctrl_351_we)
begin
reg_pciephy_ctrl_351 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_352 <= 32'h0;
end
else if(pciephy_ctrl_352_we)
begin
reg_pciephy_ctrl_352 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_353 <= 32'h0;
end
else if(pciephy_ctrl_353_we)
begin
reg_pciephy_ctrl_353 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_354 <= 32'h0;
end
else if(pciephy_ctrl_354_we)
begin
reg_pciephy_ctrl_354 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_355 <= 32'h0;
end
else if(pciephy_ctrl_355_we)
begin
reg_pciephy_ctrl_355 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_356 <= 32'h0;
end
else if(pciephy_ctrl_356_we)
begin
reg_pciephy_ctrl_356 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_357 <= 32'h0;
end
else if(pciephy_ctrl_357_we)
begin
reg_pciephy_ctrl_357 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_358 <= 32'h0;
end
else if(pciephy_ctrl_358_we)
begin
reg_pciephy_ctrl_358 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_359 <= 32'h0;
end
else if(pciephy_ctrl_359_we)
begin
reg_pciephy_ctrl_359 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_360 <= 32'h0;
end
else if(pciephy_ctrl_360_we)
begin
reg_pciephy_ctrl_360 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_361 <= 32'h0;
end
else if(pciephy_ctrl_361_we)
begin
reg_pciephy_ctrl_361 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_362 <= 32'h0;
end
else if(pciephy_ctrl_362_we)
begin
reg_pciephy_ctrl_362 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_363 <= 32'h0;
end
else if(pciephy_ctrl_363_we)
begin
reg_pciephy_ctrl_363 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_364 <= 32'h0;
end
else if(pciephy_ctrl_364_we)
begin
reg_pciephy_ctrl_364 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_365 <= 32'h0;
end
else if(pciephy_ctrl_365_we)
begin
reg_pciephy_ctrl_365 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_366 <= 32'h0;
end
else if(pciephy_ctrl_366_we)
begin
reg_pciephy_ctrl_366 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_367 <= 32'h0;
end
else if(pciephy_ctrl_367_we)
begin
reg_pciephy_ctrl_367 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_368 <= 32'h0;
end
else if(pciephy_ctrl_368_we)
begin
reg_pciephy_ctrl_368 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_369 <= 32'h0;
end
else if(pciephy_ctrl_369_we)
begin
reg_pciephy_ctrl_369 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_370 <= 32'h0;
end
else if(pciephy_ctrl_370_we)
begin
reg_pciephy_ctrl_370 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_371 <= 32'h0;
end
else if(pciephy_ctrl_371_we)
begin
reg_pciephy_ctrl_371 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_372 <= 32'h0;
end
else if(pciephy_ctrl_372_we)
begin
reg_pciephy_ctrl_372 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_373 <= 32'h0;
end
else if(pciephy_ctrl_373_we)
begin
reg_pciephy_ctrl_373 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_374 <= 32'h0;
end
else if(pciephy_ctrl_374_we)
begin
reg_pciephy_ctrl_374 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_375 <= 32'h0;
end
else if(pciephy_ctrl_375_we)
begin
reg_pciephy_ctrl_375 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_376 <= 32'h0;
end
else if(pciephy_ctrl_376_we)
begin
reg_pciephy_ctrl_376 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_377 <= 32'h0;
end
else if(pciephy_ctrl_377_we)
begin
reg_pciephy_ctrl_377 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_378 <= 32'h0;
end
else if(pciephy_ctrl_378_we)
begin
reg_pciephy_ctrl_378 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_379 <= 32'h0;
end
else if(pciephy_ctrl_379_we)
begin
reg_pciephy_ctrl_379 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_380 <= 32'h0;
end
else if(pciephy_ctrl_380_we)
begin
reg_pciephy_ctrl_380 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_381 <= 32'h0;
end
else if(pciephy_ctrl_381_we)
begin
reg_pciephy_ctrl_381 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_382 <= 32'h0;
end
else if(pciephy_ctrl_382_we)
begin
reg_pciephy_ctrl_382 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_383 <= 32'h0;
end
else if(pciephy_ctrl_383_we)
begin
reg_pciephy_ctrl_383 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_384 <= 32'h0;
end
else if(pciephy_ctrl_384_we)
begin
reg_pciephy_ctrl_384 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_385 <= 32'h0;
end
else if(pciephy_ctrl_385_we)
begin
reg_pciephy_ctrl_385 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_386 <= 32'h0;
end
else if(pciephy_ctrl_386_we)
begin
reg_pciephy_ctrl_386 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_387 <= 32'h0;
end
else if(pciephy_ctrl_387_we)
begin
reg_pciephy_ctrl_387 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_388 <= 32'h0;
end
else if(pciephy_ctrl_388_we)
begin
reg_pciephy_ctrl_388 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_389 <= 32'h0;
end
else if(pciephy_ctrl_389_we)
begin
reg_pciephy_ctrl_389 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_390 <= 32'h0;
end
else if(pciephy_ctrl_390_we)
begin
reg_pciephy_ctrl_390 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_391 <= 32'h0;
end
else if(pciephy_ctrl_391_we)
begin
reg_pciephy_ctrl_391 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_392 <= 32'h0;
end
else if(pciephy_ctrl_392_we)
begin
reg_pciephy_ctrl_392 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_393 <= 32'h0;
end
else if(pciephy_ctrl_393_we)
begin
reg_pciephy_ctrl_393 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_394 <= 32'h0;
end
else if(pciephy_ctrl_394_we)
begin
reg_pciephy_ctrl_394 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_395 <= 32'h0;
end
else if(pciephy_ctrl_395_we)
begin
reg_pciephy_ctrl_395 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_396 <= 32'h0;
end
else if(pciephy_ctrl_396_we)
begin
reg_pciephy_ctrl_396 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_397 <= 32'h0;
end
else if(pciephy_ctrl_397_we)
begin
reg_pciephy_ctrl_397 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_398 <= 32'h0;
end
else if(pciephy_ctrl_398_we)
begin
reg_pciephy_ctrl_398 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_399 <= 32'h0;
end
else if(pciephy_ctrl_399_we)
begin
reg_pciephy_ctrl_399 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_400 <= 32'h0;
end
else if(pciephy_ctrl_400_we)
begin
reg_pciephy_ctrl_400 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_401 <= 32'h0;
end
else if(pciephy_ctrl_401_we)
begin
reg_pciephy_ctrl_401 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_402 <= 32'h0;
end
else if(pciephy_ctrl_402_we)
begin
reg_pciephy_ctrl_402 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_403 <= 32'h0;
end
else if(pciephy_ctrl_403_we)
begin
reg_pciephy_ctrl_403 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_404 <= 32'h0;
end
else if(pciephy_ctrl_404_we)
begin
reg_pciephy_ctrl_404 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_405 <= 32'h0;
end
else if(pciephy_ctrl_405_we)
begin
reg_pciephy_ctrl_405 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_406 <= 32'h0;
end
else if(pciephy_ctrl_406_we)
begin
reg_pciephy_ctrl_406 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_407 <= 32'h0;
end
else if(pciephy_ctrl_407_we)
begin
reg_pciephy_ctrl_407 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_408 <= 32'h0;
end
else if(pciephy_ctrl_408_we)
begin
reg_pciephy_ctrl_408 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_409 <= 32'h0;
end
else if(pciephy_ctrl_409_we)
begin
reg_pciephy_ctrl_409 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_410 <= 32'h0;
end
else if(pciephy_ctrl_410_we)
begin
reg_pciephy_ctrl_410 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_411 <= 32'h0;
end
else if(pciephy_ctrl_411_we)
begin
reg_pciephy_ctrl_411 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_412 <= 32'h0;
end
else if(pciephy_ctrl_412_we)
begin
reg_pciephy_ctrl_412 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_413 <= 32'h0;
end
else if(pciephy_ctrl_413_we)
begin
reg_pciephy_ctrl_413 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_414 <= 32'h0;
end
else if(pciephy_ctrl_414_we)
begin
reg_pciephy_ctrl_414 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_415 <= 32'h0;
end
else if(pciephy_ctrl_415_we)
begin
reg_pciephy_ctrl_415 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_416 <= 32'h0;
end
else if(pciephy_ctrl_416_we)
begin
reg_pciephy_ctrl_416 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_417 <= 32'h0;
end
else if(pciephy_ctrl_417_we)
begin
reg_pciephy_ctrl_417 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_418 <= 32'h0;
end
else if(pciephy_ctrl_418_we)
begin
reg_pciephy_ctrl_418 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_419 <= 32'h0;
end
else if(pciephy_ctrl_419_we)
begin
reg_pciephy_ctrl_419 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_420 <= 32'h0;
end
else if(pciephy_ctrl_420_we)
begin
reg_pciephy_ctrl_420 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_421 <= 32'h0;
end
else if(pciephy_ctrl_421_we)
begin
reg_pciephy_ctrl_421 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_422 <= 32'h0;
end
else if(pciephy_ctrl_422_we)
begin
reg_pciephy_ctrl_422 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_423 <= 32'h0;
end
else if(pciephy_ctrl_423_we)
begin
reg_pciephy_ctrl_423 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_424 <= 32'h0;
end
else if(pciephy_ctrl_424_we)
begin
reg_pciephy_ctrl_424 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_425 <= 32'h0;
end
else if(pciephy_ctrl_425_we)
begin
reg_pciephy_ctrl_425 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_426 <= 32'h0;
end
else if(pciephy_ctrl_426_we)
begin
reg_pciephy_ctrl_426 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_427 <= 32'h0;
end
else if(pciephy_ctrl_427_we)
begin
reg_pciephy_ctrl_427 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_428 <= 32'h0;
end
else if(pciephy_ctrl_428_we)
begin
reg_pciephy_ctrl_428 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_429 <= 32'h0;
end
else if(pciephy_ctrl_429_we)
begin
reg_pciephy_ctrl_429 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_430 <= 32'h0;
end
else if(pciephy_ctrl_430_we)
begin
reg_pciephy_ctrl_430 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_431 <= 32'h0;
end
else if(pciephy_ctrl_431_we)
begin
reg_pciephy_ctrl_431 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_432 <= 32'h0;
end
else if(pciephy_ctrl_432_we)
begin
reg_pciephy_ctrl_432 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_433 <= 32'h0;
end
else if(pciephy_ctrl_433_we)
begin
reg_pciephy_ctrl_433 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_434 <= 32'h0;
end
else if(pciephy_ctrl_434_we)
begin
reg_pciephy_ctrl_434 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_435 <= 32'h0;
end
else if(pciephy_ctrl_435_we)
begin
reg_pciephy_ctrl_435 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_436 <= 32'h0;
end
else if(pciephy_ctrl_436_we)
begin
reg_pciephy_ctrl_436 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_437 <= 32'h0;
end
else if(pciephy_ctrl_437_we)
begin
reg_pciephy_ctrl_437 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_438 <= 32'h0;
end
else if(pciephy_ctrl_438_we)
begin
reg_pciephy_ctrl_438 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_439 <= 32'h0;
end
else if(pciephy_ctrl_439_we)
begin
reg_pciephy_ctrl_439 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_440 <= 32'h0;
end
else if(pciephy_ctrl_440_we)
begin
reg_pciephy_ctrl_440 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_441 <= 32'h0;
end
else if(pciephy_ctrl_441_we)
begin
reg_pciephy_ctrl_441 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_442 <= 32'h0;
end
else if(pciephy_ctrl_442_we)
begin
reg_pciephy_ctrl_442 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_443 <= 32'h0;
end
else if(pciephy_ctrl_443_we)
begin
reg_pciephy_ctrl_443 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_444 <= 32'h0;
end
else if(pciephy_ctrl_444_we)
begin
reg_pciephy_ctrl_444 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_445 <= 32'h0;
end
else if(pciephy_ctrl_445_we)
begin
reg_pciephy_ctrl_445 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_446 <= 32'h0;
end
else if(pciephy_ctrl_446_we)
begin
reg_pciephy_ctrl_446 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_447 <= 32'h0;
end
else if(pciephy_ctrl_447_we)
begin
reg_pciephy_ctrl_447 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_448 <= 32'h0;
end
else if(pciephy_ctrl_448_we)
begin
reg_pciephy_ctrl_448 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_449 <= 32'h0;
end
else if(pciephy_ctrl_449_we)
begin
reg_pciephy_ctrl_449 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_450 <= 32'h0;
end
else if(pciephy_ctrl_450_we)
begin
reg_pciephy_ctrl_450 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_451 <= 32'h0;
end
else if(pciephy_ctrl_451_we)
begin
reg_pciephy_ctrl_451 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_452 <= 32'h0;
end
else if(pciephy_ctrl_452_we)
begin
reg_pciephy_ctrl_452 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_453 <= 32'h0;
end
else if(pciephy_ctrl_453_we)
begin
reg_pciephy_ctrl_453 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_454 <= 32'h0;
end
else if(pciephy_ctrl_454_we)
begin
reg_pciephy_ctrl_454 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_455 <= 32'h0;
end
else if(pciephy_ctrl_455_we)
begin
reg_pciephy_ctrl_455 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_456 <= 32'h0;
end
else if(pciephy_ctrl_456_we)
begin
reg_pciephy_ctrl_456 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_457 <= 32'h0;
end
else if(pciephy_ctrl_457_we)
begin
reg_pciephy_ctrl_457 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_458 <= 32'h0;
end
else if(pciephy_ctrl_458_we)
begin
reg_pciephy_ctrl_458 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_459 <= 32'h0;
end
else if(pciephy_ctrl_459_we)
begin
reg_pciephy_ctrl_459 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_460 <= 32'h0;
end
else if(pciephy_ctrl_460_we)
begin
reg_pciephy_ctrl_460 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_461 <= 32'h0;
end
else if(pciephy_ctrl_461_we)
begin
reg_pciephy_ctrl_461 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_462 <= 32'h0;
end
else if(pciephy_ctrl_462_we)
begin
reg_pciephy_ctrl_462 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_463 <= 32'h0;
end
else if(pciephy_ctrl_463_we)
begin
reg_pciephy_ctrl_463 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_464 <= 32'h0;
end
else if(pciephy_ctrl_464_we)
begin
reg_pciephy_ctrl_464 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_465 <= 32'h0;
end
else if(pciephy_ctrl_465_we)
begin
reg_pciephy_ctrl_465 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_466 <= 32'h0;
end
else if(pciephy_ctrl_466_we)
begin
reg_pciephy_ctrl_466 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_467 <= 32'h0;
end
else if(pciephy_ctrl_467_we)
begin
reg_pciephy_ctrl_467 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_468 <= 32'h0;
end
else if(pciephy_ctrl_468_we)
begin
reg_pciephy_ctrl_468 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_469 <= 32'h0;
end
else if(pciephy_ctrl_469_we)
begin
reg_pciephy_ctrl_469 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_470 <= 32'h0;
end
else if(pciephy_ctrl_470_we)
begin
reg_pciephy_ctrl_470 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_471 <= 32'h0;
end
else if(pciephy_ctrl_471_we)
begin
reg_pciephy_ctrl_471 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_472 <= 32'h0;
end
else if(pciephy_ctrl_472_we)
begin
reg_pciephy_ctrl_472 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_473 <= 32'h0;
end
else if(pciephy_ctrl_473_we)
begin
reg_pciephy_ctrl_473 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_474 <= 32'h0;
end
else if(pciephy_ctrl_474_we)
begin
reg_pciephy_ctrl_474 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_475 <= 32'h0;
end
else if(pciephy_ctrl_475_we)
begin
reg_pciephy_ctrl_475 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_476 <= 32'h0;
end
else if(pciephy_ctrl_476_we)
begin
reg_pciephy_ctrl_476 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_477 <= 32'h0;
end
else if(pciephy_ctrl_477_we)
begin
reg_pciephy_ctrl_477 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_478 <= 32'h0;
end
else if(pciephy_ctrl_478_we)
begin
reg_pciephy_ctrl_478 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_479 <= 32'h0;
end
else if(pciephy_ctrl_479_we)
begin
reg_pciephy_ctrl_479 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_480 <= 32'h0;
end
else if(pciephy_ctrl_480_we)
begin
reg_pciephy_ctrl_480 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_481 <= 32'h0;
end
else if(pciephy_ctrl_481_we)
begin
reg_pciephy_ctrl_481 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_482 <= 32'h0;
end
else if(pciephy_ctrl_482_we)
begin
reg_pciephy_ctrl_482 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_483 <= 32'h0;
end
else if(pciephy_ctrl_483_we)
begin
reg_pciephy_ctrl_483 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_484 <= 32'h0;
end
else if(pciephy_ctrl_484_we)
begin
reg_pciephy_ctrl_484 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_485 <= 32'h0;
end
else if(pciephy_ctrl_485_we)
begin
reg_pciephy_ctrl_485 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_486 <= 32'h0;
end
else if(pciephy_ctrl_486_we)
begin
reg_pciephy_ctrl_486 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_487 <= 32'h0;
end
else if(pciephy_ctrl_487_we)
begin
reg_pciephy_ctrl_487 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_488 <= 32'h0;
end
else if(pciephy_ctrl_488_we)
begin
reg_pciephy_ctrl_488 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_489 <= 32'h0;
end
else if(pciephy_ctrl_489_we)
begin
reg_pciephy_ctrl_489 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_490 <= 32'h0;
end
else if(pciephy_ctrl_490_we)
begin
reg_pciephy_ctrl_490 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_491 <= 32'h0;
end
else if(pciephy_ctrl_491_we)
begin
reg_pciephy_ctrl_491 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_492 <= 32'h0;
end
else if(pciephy_ctrl_492_we)
begin
reg_pciephy_ctrl_492 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_493 <= 32'h0;
end
else if(pciephy_ctrl_493_we)
begin
reg_pciephy_ctrl_493 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_494 <= 32'h0;
end
else if(pciephy_ctrl_494_we)
begin
reg_pciephy_ctrl_494 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_495 <= 32'h0;
end
else if(pciephy_ctrl_495_we)
begin
reg_pciephy_ctrl_495 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_496 <= 32'h0;
end
else if(pciephy_ctrl_496_we)
begin
reg_pciephy_ctrl_496 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_497 <= 32'h0;
end
else if(pciephy_ctrl_497_we)
begin
reg_pciephy_ctrl_497 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_498 <= 32'h0;
end
else if(pciephy_ctrl_498_we)
begin
reg_pciephy_ctrl_498 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_499 <= 32'h0;
end
else if(pciephy_ctrl_499_we)
begin
reg_pciephy_ctrl_499 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_500 <= 32'h0;
end
else if(pciephy_ctrl_500_we)
begin
reg_pciephy_ctrl_500 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_501 <= 32'h0;
end
else if(pciephy_ctrl_501_we)
begin
reg_pciephy_ctrl_501 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_502 <= 32'h0;
end
else if(pciephy_ctrl_502_we)
begin
reg_pciephy_ctrl_502 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_503 <= 32'h0;
end
else if(pciephy_ctrl_503_we)
begin
reg_pciephy_ctrl_503 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_504 <= 32'h0;
end
else if(pciephy_ctrl_504_we)
begin
reg_pciephy_ctrl_504 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_505 <= 32'h0;
end
else if(pciephy_ctrl_505_we)
begin
reg_pciephy_ctrl_505 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_506 <= 32'h0;
end
else if(pciephy_ctrl_506_we)
begin
reg_pciephy_ctrl_506 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_507 <= 32'h0;
end
else if(pciephy_ctrl_507_we)
begin
reg_pciephy_ctrl_507 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_508 <= 32'h0;
end
else if(pciephy_ctrl_508_we)
begin
reg_pciephy_ctrl_508 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_509 <= 32'h0;
end
else if(pciephy_ctrl_509_we)
begin
reg_pciephy_ctrl_509 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_510 <= 32'h0;
end
else if(pciephy_ctrl_510_we)
begin
reg_pciephy_ctrl_510 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_511 <= 32'h0;
end
else if(pciephy_ctrl_511_we)
begin
reg_pciephy_ctrl_511 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_512 <= 32'h0;
end
else if(pciephy_ctrl_512_we)
begin
reg_pciephy_ctrl_512 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_513 <= 32'h0;
end
else if(pciephy_ctrl_513_we)
begin
reg_pciephy_ctrl_513 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_514 <= 32'h0;
end
else if(pciephy_ctrl_514_we)
begin
reg_pciephy_ctrl_514 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_515 <= 32'h0;
end
else if(pciephy_ctrl_515_we)
begin
reg_pciephy_ctrl_515 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_516 <= 32'h0;
end
else if(pciephy_ctrl_516_we)
begin
reg_pciephy_ctrl_516 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_517 <= 32'h0;
end
else if(pciephy_ctrl_517_we)
begin
reg_pciephy_ctrl_517 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_518 <= 32'h0;
end
else if(pciephy_ctrl_518_we)
begin
reg_pciephy_ctrl_518 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_519 <= 32'h0;
end
else if(pciephy_ctrl_519_we)
begin
reg_pciephy_ctrl_519 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_520 <= 32'h0;
end
else if(pciephy_ctrl_520_we)
begin
reg_pciephy_ctrl_520 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_521 <= 32'h0;
end
else if(pciephy_ctrl_521_we)
begin
reg_pciephy_ctrl_521 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_522 <= 32'h0;
end
else if(pciephy_ctrl_522_we)
begin
reg_pciephy_ctrl_522 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_523 <= 32'h0;
end
else if(pciephy_ctrl_523_we)
begin
reg_pciephy_ctrl_523 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_524 <= 32'h0;
end
else if(pciephy_ctrl_524_we)
begin
reg_pciephy_ctrl_524 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_525 <= 32'h0;
end
else if(pciephy_ctrl_525_we)
begin
reg_pciephy_ctrl_525 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_526 <= 32'h0;
end
else if(pciephy_ctrl_526_we)
begin
reg_pciephy_ctrl_526 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_527 <= 32'h0;
end
else if(pciephy_ctrl_527_we)
begin
reg_pciephy_ctrl_527 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_528 <= 32'h0;
end
else if(pciephy_ctrl_528_we)
begin
reg_pciephy_ctrl_528 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_529 <= 32'h0;
end
else if(pciephy_ctrl_529_we)
begin
reg_pciephy_ctrl_529 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_530 <= 32'h0;
end
else if(pciephy_ctrl_530_we)
begin
reg_pciephy_ctrl_530 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_531 <= 32'h0;
end
else if(pciephy_ctrl_531_we)
begin
reg_pciephy_ctrl_531 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_532 <= 32'h0;
end
else if(pciephy_ctrl_532_we)
begin
reg_pciephy_ctrl_532 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_533 <= 32'h0;
end
else if(pciephy_ctrl_533_we)
begin
reg_pciephy_ctrl_533 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_534 <= 32'h0;
end
else if(pciephy_ctrl_534_we)
begin
reg_pciephy_ctrl_534 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_535 <= 32'h0;
end
else if(pciephy_ctrl_535_we)
begin
reg_pciephy_ctrl_535 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_536 <= 32'h0;
end
else if(pciephy_ctrl_536_we)
begin
reg_pciephy_ctrl_536 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_537 <= 32'h0;
end
else if(pciephy_ctrl_537_we)
begin
reg_pciephy_ctrl_537 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_538 <= 32'h0;
end
else if(pciephy_ctrl_538_we)
begin
reg_pciephy_ctrl_538 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_539 <= 32'h0;
end
else if(pciephy_ctrl_539_we)
begin
reg_pciephy_ctrl_539 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_540 <= 32'h0;
end
else if(pciephy_ctrl_540_we)
begin
reg_pciephy_ctrl_540 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_541 <= 32'h0;
end
else if(pciephy_ctrl_541_we)
begin
reg_pciephy_ctrl_541 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_542 <= 32'h0;
end
else if(pciephy_ctrl_542_we)
begin
reg_pciephy_ctrl_542 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_543 <= 32'h0;
end
else if(pciephy_ctrl_543_we)
begin
reg_pciephy_ctrl_543 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_544 <= 32'h0;
end
else if(pciephy_ctrl_544_we)
begin
reg_pciephy_ctrl_544 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_545 <= 32'h0;
end
else if(pciephy_ctrl_545_we)
begin
reg_pciephy_ctrl_545 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_546 <= 32'h0;
end
else if(pciephy_ctrl_546_we)
begin
reg_pciephy_ctrl_546 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_547 <= 32'h0;
end
else if(pciephy_ctrl_547_we)
begin
reg_pciephy_ctrl_547 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_548 <= 32'h0;
end
else if(pciephy_ctrl_548_we)
begin
reg_pciephy_ctrl_548 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_549 <= 32'h0;
end
else if(pciephy_ctrl_549_we)
begin
reg_pciephy_ctrl_549 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_550 <= 32'h0;
end
else if(pciephy_ctrl_550_we)
begin
reg_pciephy_ctrl_550 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_551 <= 32'h0;
end
else if(pciephy_ctrl_551_we)
begin
reg_pciephy_ctrl_551 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_552 <= 32'h0;
end
else if(pciephy_ctrl_552_we)
begin
reg_pciephy_ctrl_552 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_553 <= 32'h0;
end
else if(pciephy_ctrl_553_we)
begin
reg_pciephy_ctrl_553 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_554 <= 32'h0;
end
else if(pciephy_ctrl_554_we)
begin
reg_pciephy_ctrl_554 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_555 <= 32'h0;
end
else if(pciephy_ctrl_555_we)
begin
reg_pciephy_ctrl_555 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_556 <= 32'h0;
end
else if(pciephy_ctrl_556_we)
begin
reg_pciephy_ctrl_556 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_557 <= 32'h0;
end
else if(pciephy_ctrl_557_we)
begin
reg_pciephy_ctrl_557 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_558 <= 32'h0;
end
else if(pciephy_ctrl_558_we)
begin
reg_pciephy_ctrl_558 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_559 <= 32'h0;
end
else if(pciephy_ctrl_559_we)
begin
reg_pciephy_ctrl_559 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_560 <= 32'h0;
end
else if(pciephy_ctrl_560_we)
begin
reg_pciephy_ctrl_560 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_561 <= 32'h0;
end
else if(pciephy_ctrl_561_we)
begin
reg_pciephy_ctrl_561 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_562 <= 32'h0;
end
else if(pciephy_ctrl_562_we)
begin
reg_pciephy_ctrl_562 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_563 <= 32'h0;
end
else if(pciephy_ctrl_563_we)
begin
reg_pciephy_ctrl_563 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_pciephy_ctrl_564 <= 32'h0;
end
else if(pciephy_ctrl_564_we)
begin
reg_pciephy_ctrl_564 <= reg_wdata;
end


always_ff @( posedge clk  or negedge rst_b )

if(!rst_b)
begin
reg_rdata <= 32'h0;
end
else if(reg_rd)
begin
reg_rdata <= next_rdata;
end



endmodule
 : pcie_reg
