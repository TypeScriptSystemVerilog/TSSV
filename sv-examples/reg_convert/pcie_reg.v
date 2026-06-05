import pcie_reg_pkg::*;

// =============================================================================
// Generated Register Block 1.0
// =============================================================================

                
               
        module pcie_reg 
           (
           input   clk,
   input   rst_b,
   input  [11:0] paddr,
   input  [31:0] pwdata,
   output  [31:0] prdata,
   input   psel,
   input   penable,
   input   pwrite,
   output   pready,
   output reg   pslverr,
   output  [31:0] cfg_pciephy_ctrl_0,
   output  [31:0] cfg_pciephy_ctrl_1,
   input  [31:0] cfg_pciephy_ctrl_2,
   output  [31:0] cfg_pciephy_ctrl_3,
   output  [31:0] cfg_pciephy_ctrl_4,
   output  [31:0] cfg_pciephy_ctrl_5,
   output  [31:0] cfg_pciephy_ctrl_6,
   output  [31:0] cfg_pciephy_ctrl_7,
   output  [31:0] cfg_pciephy_ctrl_8,
   output  [31:0] cfg_pciephy_ctrl_9,
   output  [31:0] cfg_pciephy_ctrl_10,
   output  [31:0] cfg_pciephy_ctrl_11,
   output  [31:0] cfg_pciephy_ctrl_12,
   output  [31:0] cfg_pciephy_ctrl_13,
   output  [31:0] cfg_pciephy_ctrl_14,
   output  [31:0] cfg_pciephy_ctrl_15,
   output  [31:0] cfg_pciephy_ctrl_16,
   output  [31:0] cfg_pciephy_ctrl_17,
   output  [31:0] cfg_pciephy_ctrl_18,
   output  [31:0] cfg_pciephy_ctrl_19,
   output  [31:0] cfg_pciephy_ctrl_20,
   output  [31:0] cfg_pciephy_ctrl_21,
   output  [31:0] cfg_pciephy_ctrl_22,
   output  [31:0] cfg_pciephy_ctrl_23,
   output  [31:0] cfg_pciephy_ctrl_24,
   output  [31:0] cfg_pciephy_ctrl_25,
   output  [31:0] cfg_pciephy_ctrl_26,
   output  [31:0] cfg_pciephy_ctrl_27,
   output  [31:0] cfg_pciephy_ctrl_28,
   output  [31:0] cfg_pciephy_ctrl_29,
   output  [31:0] cfg_pciephy_ctrl_30,
   output  [31:0] cfg_pciephy_ctrl_31,
   output  [31:0] cfg_pciephy_ctrl_32,
   output  [31:0] cfg_pciephy_ctrl_33,
   output  [31:0] cfg_pciephy_ctrl_34,
   output  [31:0] cfg_pciephy_ctrl_35,
   output  [31:0] cfg_pciephy_ctrl_36,
   output  [31:0] cfg_pciephy_ctrl_37,
   output  [31:0] cfg_pciephy_ctrl_38,
   output  [31:0] cfg_pciephy_ctrl_39,
   output  [31:0] cfg_pciephy_ctrl_40,
   output  [31:0] cfg_pciephy_ctrl_41,
   output  [31:0] cfg_pciephy_ctrl_42,
   output  [31:0] cfg_pciephy_ctrl_43,
   output  [31:0] cfg_pciephy_ctrl_44,
   output  [31:0] cfg_pciephy_ctrl_45,
   output  [31:0] cfg_pciephy_ctrl_46,
   output  [31:0] cfg_pciephy_ctrl_47,
   output  [31:0] cfg_pciephy_ctrl_48,
   output  [31:0] cfg_pciephy_ctrl_49,
   output  [31:0] cfg_pciephy_ctrl_50,
   output  [31:0] cfg_pciephy_ctrl_51,
   output  [31:0] cfg_pciephy_ctrl_52,
   output  [31:0] cfg_pciephy_ctrl_53,
   output  [31:0] cfg_pciephy_ctrl_54,
   output  [31:0] cfg_pciephy_ctrl_55,
   output  [31:0] cfg_pciephy_ctrl_56,
   output  [31:0] cfg_pciephy_ctrl_57,
   output  [31:0] cfg_pciephy_ctrl_58,
   output  [31:0] cfg_pciephy_ctrl_59,
   output  [31:0] cfg_pciephy_ctrl_60,
   output  [31:0] cfg_pciephy_ctrl_61,
   output  [31:0] cfg_pciephy_ctrl_62,
   output  [31:0] cfg_pciephy_ctrl_63,
   output  [31:0] cfg_pciephy_ctrl_64,
   output  [31:0] cfg_pciephy_ctrl_65,
   output  [31:0] cfg_pciephy_ctrl_66,
   output  [31:0] cfg_pciephy_ctrl_67,
   output  [31:0] cfg_pciephy_ctrl_68,
   output  [31:0] cfg_pciephy_ctrl_69,
   output  [31:0] cfg_pciephy_ctrl_70,
   output  [31:0] cfg_pciephy_ctrl_71,
   output  [31:0] cfg_pciephy_ctrl_72,
   output  [31:0] cfg_pciephy_ctrl_73,
   output  [31:0] cfg_pciephy_ctrl_74,
   output  [31:0] cfg_pciephy_ctrl_75,
   output  [31:0] cfg_pciephy_ctrl_76,
   output  [31:0] cfg_pciephy_ctrl_77,
   output  [31:0] cfg_pciephy_ctrl_78,
   output  [31:0] cfg_pciephy_ctrl_79,
   output  [31:0] cfg_pciephy_ctrl_80,
   output  [31:0] cfg_pciephy_ctrl_81,
   output  [31:0] cfg_pciephy_ctrl_82,
   output  [31:0] cfg_pciephy_ctrl_83,
   output  [31:0] cfg_pciephy_ctrl_84,
   output  [31:0] cfg_pciephy_ctrl_85,
   output  [31:0] cfg_pciephy_ctrl_86,
   output  [31:0] cfg_pciephy_ctrl_87,
   output  [31:0] cfg_pciephy_ctrl_88,
   output  [31:0] cfg_pciephy_ctrl_89,
   output  [31:0] cfg_pciephy_ctrl_90,
   output  [31:0] cfg_pciephy_ctrl_91,
   output  [31:0] cfg_pciephy_ctrl_92,
   output  [31:0] cfg_pciephy_ctrl_93,
   output  [31:0] cfg_pciephy_ctrl_94,
   output  [31:0] cfg_pciephy_ctrl_95,
   output  [31:0] cfg_pciephy_ctrl_96,
   output  [31:0] cfg_pciephy_ctrl_97,
   output  [31:0] cfg_pciephy_ctrl_98,
   output  [31:0] cfg_pciephy_ctrl_99,
   output  [31:0] cfg_pciephy_ctrl_100,
   output  [31:0] cfg_pciephy_ctrl_101,
   output  [31:0] cfg_pciephy_ctrl_102,
   output  [31:0] cfg_pciephy_ctrl_103,
   output  [31:0] cfg_pciephy_ctrl_104,
   output  [31:0] cfg_pciephy_ctrl_105,
   output  [31:0] cfg_pciephy_ctrl_106,
   output  [31:0] cfg_pciephy_ctrl_107,
   output  [31:0] cfg_pciephy_ctrl_108,
   output  [31:0] cfg_pciephy_ctrl_109,
   output  [31:0] cfg_pciephy_ctrl_110,
   output  [31:0] cfg_pciephy_ctrl_111,
   output  [31:0] cfg_pciephy_ctrl_112,
   output  [31:0] cfg_pciephy_ctrl_113,
   output  [31:0] cfg_pciephy_ctrl_114,
   output  [31:0] cfg_pciephy_ctrl_115,
   output  [31:0] cfg_pciephy_ctrl_116,
   output  [31:0] cfg_pciephy_ctrl_117,
   output  [31:0] cfg_pciephy_ctrl_118,
   output  [31:0] cfg_pciephy_ctrl_119,
   output  [31:0] cfg_pciephy_ctrl_120,
   output  [31:0] cfg_pciephy_ctrl_121,
   output  [31:0] cfg_pciephy_ctrl_122,
   output  [31:0] cfg_pciephy_ctrl_123,
   output  [31:0] cfg_pciephy_ctrl_124,
   output  [31:0] cfg_pciephy_ctrl_125,
   output  [31:0] cfg_pciephy_ctrl_126,
   output  [31:0] cfg_pciephy_ctrl_127,
   output  [31:0] cfg_pciephy_ctrl_128,
   output  [31:0] cfg_pciephy_ctrl_129,
   output  [31:0] cfg_pciephy_ctrl_130,
   output  [31:0] cfg_pciephy_ctrl_131,
   output  [31:0] cfg_pciephy_ctrl_132,
   output  [31:0] cfg_pciephy_ctrl_133,
   output  [31:0] cfg_pciephy_ctrl_134,
   output  [31:0] cfg_pciephy_ctrl_135,
   output  [31:0] cfg_pciephy_ctrl_136,
   output  [31:0] cfg_pciephy_ctrl_137,
   output  [31:0] cfg_pciephy_ctrl_138,
   output  [31:0] cfg_pciephy_ctrl_139,
   output  [31:0] cfg_pciephy_ctrl_140,
   output  [31:0] cfg_pciephy_ctrl_141,
   output  [31:0] cfg_pciephy_ctrl_142,
   output  [31:0] cfg_pciephy_ctrl_143,
   output  [31:0] cfg_pciephy_ctrl_144,
   output  [31:0] cfg_pciephy_ctrl_145,
   output  [31:0] cfg_pciephy_ctrl_146,
   output  [31:0] cfg_pciephy_ctrl_147,
   output  [31:0] cfg_pciephy_ctrl_148,
   output  [31:0] cfg_pciephy_ctrl_149,
   output  [31:0] cfg_pciephy_ctrl_150,
   output  [31:0] cfg_pciephy_ctrl_151,
   output  [31:0] cfg_pciephy_ctrl_152,
   output  [31:0] cfg_pciephy_ctrl_153,
   output  [31:0] cfg_pciephy_ctrl_154,
   output  [31:0] cfg_pciephy_ctrl_155,
   output  [31:0] cfg_pciephy_ctrl_156,
   output  [31:0] cfg_pciephy_ctrl_157,
   output  [31:0] cfg_pciephy_ctrl_158,
   output  [31:0] cfg_pciephy_ctrl_159,
   output  [31:0] cfg_pciephy_ctrl_160,
   output  [31:0] cfg_pciephy_ctrl_161,
   output  [31:0] cfg_pciephy_ctrl_162,
   output  [31:0] cfg_pciephy_ctrl_163,
   output  [31:0] cfg_pciephy_ctrl_164,
   output  [31:0] cfg_pciephy_ctrl_165,
   output  [31:0] cfg_pciephy_ctrl_166,
   output  [31:0] cfg_pciephy_ctrl_167,
   output  [31:0] cfg_pciephy_ctrl_168,
   output  [31:0] cfg_pciephy_ctrl_169,
   output  [31:0] cfg_pciephy_ctrl_170,
   output  [31:0] cfg_pciephy_ctrl_171,
   output  [31:0] cfg_pciephy_ctrl_172,
   output  [31:0] cfg_pciephy_ctrl_173,
   output  [31:0] cfg_pciephy_ctrl_174,
   output  [31:0] cfg_pciephy_ctrl_175,
   output  [31:0] cfg_pciephy_ctrl_176,
   output  [31:0] cfg_pciephy_ctrl_177,
   output  [31:0] cfg_pciephy_ctrl_178,
   output  [31:0] cfg_pciephy_ctrl_179,
   output  [31:0] cfg_pciephy_ctrl_180,
   output  [31:0] cfg_pciephy_ctrl_181,
   output  [31:0] cfg_pciephy_ctrl_182,
   output  [31:0] cfg_pciephy_ctrl_183,
   output  [31:0] cfg_pciephy_ctrl_184,
   output  [31:0] cfg_pciephy_ctrl_185,
   output  [31:0] cfg_pciephy_ctrl_186,
   output  [31:0] cfg_pciephy_ctrl_187,
   output  [31:0] cfg_pciephy_ctrl_188,
   output  [31:0] cfg_pciephy_ctrl_189,
   output  [31:0] cfg_pciephy_ctrl_190,
   output  [31:0] cfg_pciephy_ctrl_191,
   output  [31:0] cfg_pciephy_ctrl_192,
   output  [31:0] cfg_pciephy_ctrl_193,
   output  [31:0] cfg_pciephy_ctrl_194,
   output  [31:0] cfg_pciephy_ctrl_195,
   output  [31:0] cfg_pciephy_ctrl_196,
   output  [31:0] cfg_pciephy_ctrl_197,
   output  [31:0] cfg_pciephy_ctrl_198,
   output  [31:0] cfg_pciephy_ctrl_199,
   output  [31:0] cfg_pciephy_ctrl_200,
   output  [31:0] cfg_pciephy_ctrl_201,
   output  [31:0] cfg_pciephy_ctrl_202,
   output  [31:0] cfg_pciephy_ctrl_203,
   output  [31:0] cfg_pciephy_ctrl_204,
   output  [31:0] cfg_pciephy_ctrl_205,
   output  [31:0] cfg_pciephy_ctrl_206,
   output  [31:0] cfg_pciephy_ctrl_207,
   output  [31:0] cfg_pciephy_ctrl_208,
   output  [31:0] cfg_pciephy_ctrl_209,
   output  [31:0] cfg_pciephy_ctrl_210,
   output  [31:0] cfg_pciephy_ctrl_211,
   output  [31:0] cfg_pciephy_ctrl_212,
   output  [31:0] cfg_pciephy_ctrl_213,
   output  [31:0] cfg_pciephy_ctrl_214,
   output  [31:0] cfg_pciephy_ctrl_215,
   output  [31:0] cfg_pciephy_ctrl_216,
   output  [31:0] cfg_pciephy_ctrl_217,
   output  [31:0] cfg_pciephy_ctrl_218,
   output  [31:0] cfg_pciephy_ctrl_219,
   output  [31:0] cfg_pciephy_ctrl_220,
   output  [31:0] cfg_pciephy_ctrl_221,
   output  [31:0] cfg_pciephy_ctrl_222,
   output  [31:0] cfg_pciephy_ctrl_223,
   output  [31:0] cfg_pciephy_ctrl_224,
   output  [31:0] cfg_pciephy_ctrl_225,
   output  [31:0] cfg_pciephy_ctrl_226,
   output  [31:0] cfg_pciephy_ctrl_227,
   output  [31:0] cfg_pciephy_ctrl_228,
   output  [31:0] cfg_pciephy_ctrl_229,
   output  [31:0] cfg_pciephy_ctrl_230,
   output  [31:0] cfg_pciephy_ctrl_231,
   output  [31:0] cfg_pciephy_ctrl_232,
   output  [31:0] cfg_pciephy_ctrl_233,
   output  [31:0] cfg_pciephy_ctrl_234,
   output  [31:0] cfg_pciephy_ctrl_235,
   output  [31:0] cfg_pciephy_ctrl_236,
   output  [31:0] cfg_pciephy_ctrl_237,
   output  [31:0] cfg_pciephy_ctrl_238,
   output  [31:0] cfg_pciephy_ctrl_239,
   output  [31:0] cfg_pciephy_ctrl_240,
   output  [31:0] cfg_pciephy_ctrl_241,
   output  [31:0] cfg_pciephy_ctrl_242,
   output  [31:0] cfg_pciephy_ctrl_243,
   output  [31:0] cfg_pciephy_ctrl_244,
   output  [31:0] cfg_pciephy_ctrl_245,
   output  [31:0] cfg_pciephy_ctrl_246,
   output  [31:0] cfg_pciephy_ctrl_247,
   output  [31:0] cfg_pciephy_ctrl_248,
   output  [31:0] cfg_pciephy_ctrl_249,
   output  [31:0] cfg_pciephy_ctrl_250,
   output  [31:0] cfg_pciephy_ctrl_251,
   output  [31:0] cfg_pciephy_ctrl_252,
   output  [31:0] cfg_pciephy_ctrl_253,
   output  [31:0] cfg_pciephy_ctrl_254,
   output  [31:0] cfg_pciephy_ctrl_255,
   output  [31:0] cfg_pciephy_ctrl_256,
   output  [31:0] cfg_pciephy_ctrl_257,
   output  [31:0] cfg_pciephy_ctrl_258,
   output  [31:0] cfg_pciephy_ctrl_259,
   output  [31:0] cfg_pciephy_ctrl_260,
   output  [31:0] cfg_pciephy_ctrl_261,
   output  [31:0] cfg_pciephy_ctrl_262,
   output  [31:0] cfg_pciephy_ctrl_263,
   output  [31:0] cfg_pciephy_ctrl_264,
   output  [31:0] cfg_pciephy_ctrl_265,
   output  [31:0] cfg_pciephy_ctrl_266,
   output  [31:0] cfg_pciephy_ctrl_267,
   output  [31:0] cfg_pciephy_ctrl_268,
   output  [31:0] cfg_pciephy_ctrl_269,
   output  [31:0] cfg_pciephy_ctrl_270,
   output  [31:0] cfg_pciephy_ctrl_271,
   output  [31:0] cfg_pciephy_ctrl_272,
   output  [31:0] cfg_pciephy_ctrl_273,
   output  [31:0] cfg_pciephy_ctrl_274,
   output  [31:0] cfg_pciephy_ctrl_275,
   output  [31:0] cfg_pciephy_ctrl_276,
   output  [31:0] cfg_pciephy_ctrl_277,
   output  [31:0] cfg_pciephy_ctrl_278,
   output  [31:0] cfg_pciephy_ctrl_279,
   output  [31:0] cfg_pciephy_ctrl_280,
   output  [31:0] cfg_pciephy_ctrl_281,
   output  [31:0] cfg_pciephy_ctrl_282,
   output  [31:0] cfg_pciephy_ctrl_283,
   output  [31:0] cfg_pciephy_ctrl_284,
   output  [31:0] cfg_pciephy_ctrl_285,
   output  [31:0] cfg_pciephy_ctrl_286,
   output  [31:0] cfg_pciephy_ctrl_287,
   output  [31:0] cfg_pciephy_ctrl_288,
   output  [31:0] cfg_pciephy_ctrl_289,
   output  [31:0] cfg_pciephy_ctrl_290,
   output  [31:0] cfg_pciephy_ctrl_291,
   output  [31:0] cfg_pciephy_ctrl_292,
   output  [31:0] cfg_pciephy_ctrl_293,
   output  [31:0] cfg_pciephy_ctrl_294,
   output  [31:0] cfg_pciephy_ctrl_295,
   output  [31:0] cfg_pciephy_ctrl_296,
   output  [31:0] cfg_pciephy_ctrl_297,
   output  [31:0] cfg_pciephy_ctrl_298,
   output  [31:0] cfg_pciephy_ctrl_299,
   output  [31:0] cfg_pciephy_ctrl_300,
   output  [31:0] cfg_pciephy_ctrl_301,
   output  [31:0] cfg_pciephy_ctrl_302,
   output  [31:0] cfg_pciephy_ctrl_303,
   output  [31:0] cfg_pciephy_ctrl_304,
   output  [31:0] cfg_pciephy_ctrl_305,
   output  [31:0] cfg_pciephy_ctrl_306,
   output  [31:0] cfg_pciephy_ctrl_307,
   output  [31:0] cfg_pciephy_ctrl_308,
   output  [31:0] cfg_pciephy_ctrl_309,
   output  [31:0] cfg_pciephy_ctrl_310,
   output  [31:0] cfg_pciephy_ctrl_311,
   output  [31:0] cfg_pciephy_ctrl_312,
   output  [31:0] cfg_pciephy_ctrl_313,
   output  [31:0] cfg_pciephy_ctrl_314,
   output  [31:0] cfg_pciephy_ctrl_315,
   output  [31:0] cfg_pciephy_ctrl_316,
   output  [31:0] cfg_pciephy_ctrl_317,
   output  [31:0] cfg_pciephy_ctrl_318,
   output  [31:0] cfg_pciephy_ctrl_319,
   output  [31:0] cfg_pciephy_ctrl_320,
   output  [31:0] cfg_pciephy_ctrl_321,
   output  [31:0] cfg_pciephy_ctrl_322,
   output  [31:0] cfg_pciephy_ctrl_323,
   output  [31:0] cfg_pciephy_ctrl_324,
   output  [31:0] cfg_pciephy_ctrl_325,
   output  [31:0] cfg_pciephy_ctrl_326,
   output  [31:0] cfg_pciephy_ctrl_327,
   output  [31:0] cfg_pciephy_ctrl_328,
   output  [31:0] cfg_pciephy_ctrl_329,
   output  [31:0] cfg_pciephy_ctrl_330,
   output  [31:0] cfg_pciephy_ctrl_331,
   output  [31:0] cfg_pciephy_ctrl_332,
   output  [31:0] cfg_pciephy_ctrl_333,
   output  [31:0] cfg_pciephy_ctrl_334,
   output  [31:0] cfg_pciephy_ctrl_335,
   output  [31:0] cfg_pciephy_ctrl_336,
   output  [31:0] cfg_pciephy_ctrl_337,
   output  [31:0] cfg_pciephy_ctrl_338,
   output  [31:0] cfg_pciephy_ctrl_339,
   output  [31:0] cfg_pciephy_ctrl_340,
   output  [31:0] cfg_pciephy_ctrl_341,
   output  [31:0] cfg_pciephy_ctrl_342,
   output  [31:0] cfg_pciephy_ctrl_343,
   output  [31:0] cfg_pciephy_ctrl_344,
   output  [31:0] cfg_pciephy_ctrl_345,
   output  [31:0] cfg_pciephy_ctrl_346,
   output  [31:0] cfg_pciephy_ctrl_347,
   output  [31:0] cfg_pciephy_ctrl_348,
   output  [31:0] cfg_pciephy_ctrl_349,
   output  [31:0] cfg_pciephy_ctrl_350,
   output  [31:0] cfg_pciephy_ctrl_351,
   output  [31:0] cfg_pciephy_ctrl_352,
   output  [31:0] cfg_pciephy_ctrl_353,
   output  [31:0] cfg_pciephy_ctrl_354,
   output  [31:0] cfg_pciephy_ctrl_355,
   output  [31:0] cfg_pciephy_ctrl_356,
   output  [31:0] cfg_pciephy_ctrl_357,
   output  [31:0] cfg_pciephy_ctrl_358,
   output  [31:0] cfg_pciephy_ctrl_359,
   output  [31:0] cfg_pciephy_ctrl_360,
   output  [31:0] cfg_pciephy_ctrl_361,
   output  [31:0] cfg_pciephy_ctrl_362,
   output  [31:0] cfg_pciephy_ctrl_363,
   output  [31:0] cfg_pciephy_ctrl_364,
   output  [31:0] cfg_pciephy_ctrl_365,
   output  [31:0] cfg_pciephy_ctrl_366,
   output  [31:0] cfg_pciephy_ctrl_367,
   output  [31:0] cfg_pciephy_ctrl_368,
   output  [31:0] cfg_pciephy_ctrl_369,
   output  [31:0] cfg_pciephy_ctrl_370,
   output  [31:0] cfg_pciephy_ctrl_371,
   output  [31:0] cfg_pciephy_ctrl_372,
   output  [31:0] cfg_pciephy_ctrl_373,
   output  [31:0] cfg_pciephy_ctrl_374,
   output  [31:0] cfg_pciephy_ctrl_375,
   output  [31:0] cfg_pciephy_ctrl_376,
   output  [31:0] cfg_pciephy_ctrl_377,
   output  [31:0] cfg_pciephy_ctrl_378,
   output  [31:0] cfg_pciephy_ctrl_379,
   output  [31:0] cfg_pciephy_ctrl_380,
   output  [31:0] cfg_pciephy_ctrl_381,
   output  [31:0] cfg_pciephy_ctrl_382,
   output  [31:0] cfg_pciephy_ctrl_383,
   output  [31:0] cfg_pciephy_ctrl_384,
   output  [31:0] cfg_pciephy_ctrl_385,
   output  [31:0] cfg_pciephy_ctrl_386,
   output  [31:0] cfg_pciephy_ctrl_387,
   output  [31:0] cfg_pciephy_ctrl_388,
   output  [31:0] cfg_pciephy_ctrl_389,
   output  [31:0] cfg_pciephy_ctrl_390,
   output  [31:0] cfg_pciephy_ctrl_391,
   output  [31:0] cfg_pciephy_ctrl_392,
   output  [31:0] cfg_pciephy_ctrl_393,
   output  [31:0] cfg_pciephy_ctrl_394,
   output  [31:0] cfg_pciephy_ctrl_395,
   output  [31:0] cfg_pciephy_ctrl_396,
   output  [31:0] cfg_pciephy_ctrl_397,
   output  [31:0] cfg_pciephy_ctrl_398,
   output  [31:0] cfg_pciephy_ctrl_399,
   output  [31:0] cfg_pciephy_ctrl_400,
   output  [31:0] cfg_pciephy_ctrl_401,
   output  [31:0] cfg_pciephy_ctrl_402,
   output  [31:0] cfg_pciephy_ctrl_403,
   output  [31:0] cfg_pciephy_ctrl_404,
   output  [31:0] cfg_pciephy_ctrl_405,
   output  [31:0] cfg_pciephy_ctrl_406,
   output  [31:0] cfg_pciephy_ctrl_407,
   output  [31:0] cfg_pciephy_ctrl_408,
   output  [31:0] cfg_pciephy_ctrl_409,
   output  [31:0] cfg_pciephy_ctrl_410,
   output  [31:0] cfg_pciephy_ctrl_411,
   output  [31:0] cfg_pciephy_ctrl_412,
   output  [31:0] cfg_pciephy_ctrl_413,
   output  [31:0] cfg_pciephy_ctrl_414,
   output  [31:0] cfg_pciephy_ctrl_415,
   output  [31:0] cfg_pciephy_ctrl_416,
   output  [31:0] cfg_pciephy_ctrl_417,
   output  [31:0] cfg_pciephy_ctrl_418,
   output  [31:0] cfg_pciephy_ctrl_419,
   output  [31:0] cfg_pciephy_ctrl_420,
   output  [31:0] cfg_pciephy_ctrl_421,
   output  [31:0] cfg_pciephy_ctrl_422,
   output  [31:0] cfg_pciephy_ctrl_423,
   output  [31:0] cfg_pciephy_ctrl_424,
   output  [31:0] cfg_pciephy_ctrl_425,
   output  [31:0] cfg_pciephy_ctrl_426,
   output  [31:0] cfg_pciephy_ctrl_427,
   output  [31:0] cfg_pciephy_ctrl_428,
   output  [31:0] cfg_pciephy_ctrl_429,
   output  [31:0] cfg_pciephy_ctrl_430,
   output  [31:0] cfg_pciephy_ctrl_431,
   output  [31:0] cfg_pciephy_ctrl_432,
   output  [31:0] cfg_pciephy_ctrl_433,
   output  [31:0] cfg_pciephy_ctrl_434,
   output  [31:0] cfg_pciephy_ctrl_435,
   output  [31:0] cfg_pciephy_ctrl_436,
   output  [31:0] cfg_pciephy_ctrl_437,
   output  [31:0] cfg_pciephy_ctrl_438,
   output  [31:0] cfg_pciephy_ctrl_439,
   output  [31:0] cfg_pciephy_ctrl_440,
   output  [31:0] cfg_pciephy_ctrl_441,
   output  [31:0] cfg_pciephy_ctrl_442,
   output  [31:0] cfg_pciephy_ctrl_443,
   output  [31:0] cfg_pciephy_ctrl_444,
   output  [31:0] cfg_pciephy_ctrl_445,
   output  [31:0] cfg_pciephy_ctrl_446,
   output  [31:0] cfg_pciephy_ctrl_447,
   output  [31:0] cfg_pciephy_ctrl_448,
   output  [31:0] cfg_pciephy_ctrl_449,
   output  [31:0] cfg_pciephy_ctrl_450,
   output  [31:0] cfg_pciephy_ctrl_451,
   output  [31:0] cfg_pciephy_ctrl_452,
   output  [31:0] cfg_pciephy_ctrl_453,
   output  [31:0] cfg_pciephy_ctrl_454,
   output  [31:0] cfg_pciephy_ctrl_455,
   output  [31:0] cfg_pciephy_ctrl_456,
   output  [31:0] cfg_pciephy_ctrl_457,
   output  [31:0] cfg_pciephy_ctrl_458,
   output  [31:0] cfg_pciephy_ctrl_459,
   output  [31:0] cfg_pciephy_ctrl_460,
   output  [31:0] cfg_pciephy_ctrl_461,
   output  [31:0] cfg_pciephy_ctrl_462,
   output  [31:0] cfg_pciephy_ctrl_463,
   output  [31:0] cfg_pciephy_ctrl_464,
   output  [31:0] cfg_pciephy_ctrl_465,
   output  [31:0] cfg_pciephy_ctrl_466,
   output  [31:0] cfg_pciephy_ctrl_467,
   output  [31:0] cfg_pciephy_ctrl_468,
   output  [31:0] cfg_pciephy_ctrl_469,
   output  [31:0] cfg_pciephy_ctrl_470,
   output  [31:0] cfg_pciephy_ctrl_471,
   output  [31:0] cfg_pciephy_ctrl_472,
   output  [31:0] cfg_pciephy_ctrl_473,
   output  [31:0] cfg_pciephy_ctrl_474,
   output  [31:0] cfg_pciephy_ctrl_475,
   output  [31:0] cfg_pciephy_ctrl_476,
   output  [31:0] cfg_pciephy_ctrl_477,
   output  [31:0] cfg_pciephy_ctrl_478,
   output  [31:0] cfg_pciephy_ctrl_479,
   output  [31:0] cfg_pciephy_ctrl_480,
   output  [31:0] cfg_pciephy_ctrl_481,
   output  [31:0] cfg_pciephy_ctrl_482,
   output  [31:0] cfg_pciephy_ctrl_483,
   output  [31:0] cfg_pciephy_ctrl_484,
   output  [31:0] cfg_pciephy_ctrl_485,
   output  [31:0] cfg_pciephy_ctrl_486,
   output  [31:0] cfg_pciephy_ctrl_487,
   output  [31:0] cfg_pciephy_ctrl_488,
   output  [31:0] cfg_pciephy_ctrl_489,
   output  [31:0] cfg_pciephy_ctrl_490,
   output  [31:0] cfg_pciephy_ctrl_491,
   output  [31:0] cfg_pciephy_ctrl_492,
   output  [31:0] cfg_pciephy_ctrl_493,
   output  [31:0] cfg_pciephy_ctrl_494,
   output  [31:0] cfg_pciephy_ctrl_495,
   output  [31:0] cfg_pciephy_ctrl_496,
   output  [31:0] cfg_pciephy_ctrl_497,
   output  [31:0] cfg_pciephy_ctrl_498,
   output  [31:0] cfg_pciephy_ctrl_499,
   output  [31:0] cfg_pciephy_ctrl_500,
   output  [31:0] cfg_pciephy_ctrl_501,
   output  [31:0] cfg_pciephy_ctrl_502,
   output  [31:0] cfg_pciephy_ctrl_503,
   output  [31:0] cfg_pciephy_ctrl_504,
   output  [31:0] cfg_pciephy_ctrl_505,
   output  [31:0] cfg_pciephy_ctrl_506,
   output  [31:0] cfg_pciephy_ctrl_507,
   output  [31:0] cfg_pciephy_ctrl_508,
   output  [31:0] cfg_pciephy_ctrl_509,
   output  [31:0] cfg_pciephy_ctrl_510,
   output  [31:0] cfg_pciephy_ctrl_511,
   output  [31:0] cfg_pciephy_ctrl_512,
   output  [31:0] cfg_pciephy_ctrl_513,
   output  [31:0] cfg_pciephy_ctrl_514,
   output  [31:0] cfg_pciephy_ctrl_515,
   output  [31:0] cfg_pciephy_ctrl_516,
   output  [31:0] cfg_pciephy_ctrl_517,
   output  [31:0] cfg_pciephy_ctrl_518,
   output  [31:0] cfg_pciephy_ctrl_519,
   output  [31:0] cfg_pciephy_ctrl_520,
   output  [31:0] cfg_pciephy_ctrl_521,
   output  [31:0] cfg_pciephy_ctrl_522,
   output  [31:0] cfg_pciephy_ctrl_523,
   output  [31:0] cfg_pciephy_ctrl_524,
   output  [31:0] cfg_pciephy_ctrl_525,
   output  [31:0] cfg_pciephy_ctrl_526,
   output  [31:0] cfg_pciephy_ctrl_527,
   output  [31:0] cfg_pciephy_ctrl_528,
   output  [31:0] cfg_pciephy_ctrl_529,
   output  [31:0] cfg_pciephy_ctrl_530,
   output  [31:0] cfg_pciephy_ctrl_531,
   output  [31:0] cfg_pciephy_ctrl_532,
   output  [31:0] cfg_pciephy_ctrl_533,
   output  [31:0] cfg_pciephy_ctrl_534,
   output  [31:0] cfg_pciephy_ctrl_535,
   output  [31:0] cfg_pciephy_ctrl_536,
   output  [31:0] cfg_pciephy_ctrl_537,
   output  [31:0] cfg_pciephy_ctrl_538,
   output  [31:0] cfg_pciephy_ctrl_539,
   output  [31:0] cfg_pciephy_ctrl_540,
   output  [31:0] cfg_pciephy_ctrl_541,
   output  [31:0] cfg_pciephy_ctrl_542,
   output  [31:0] cfg_pciephy_ctrl_543,
   output  [31:0] cfg_pciephy_ctrl_544,
   output  [31:0] cfg_pciephy_ctrl_545,
   output  [31:0] cfg_pciephy_ctrl_546,
   output  [31:0] cfg_pciephy_ctrl_547,
   output  [31:0] cfg_pciephy_ctrl_548,
   output  [31:0] cfg_pciephy_ctrl_549,
   output  [31:0] cfg_pciephy_ctrl_550,
   output  [31:0] cfg_pciephy_ctrl_551,
   output  [31:0] cfg_pciephy_ctrl_552,
   output  [31:0] cfg_pciephy_ctrl_553,
   output  [31:0] cfg_pciephy_ctrl_554,
   output  [31:0] cfg_pciephy_ctrl_555,
   output  [31:0] cfg_pciephy_ctrl_556,
   output  [31:0] cfg_pciephy_ctrl_557,
   output  [31:0] cfg_pciephy_ctrl_558,
   output  [31:0] cfg_pciephy_ctrl_559,
   output  [31:0] cfg_pciephy_ctrl_560,
   output  [31:0] cfg_pciephy_ctrl_561,
   output  [31:0] cfg_pciephy_ctrl_562,
   output  [31:0] cfg_pciephy_ctrl_563,
   output  [31:0] cfg_pciephy_ctrl_564,
   input  [31:0] cfg_pciephy_ctrl_565,
   input  [31:0] cfg_pciephy_ctrl_566,
   input  [31:0] cfg_pciephy_ctrl_567,
   input  [31:0] cfg_pciephy_ctrl_568,
   input  [31:0] cfg_pciephy_ctrl_569,
   input  [31:0] cfg_pciephy_ctrl_570,
   input  [31:0] cfg_pciephy_ctrl_571,
   input  [31:0] cfg_pciephy_ctrl_572,
   input  [31:0] cfg_pciephy_ctrl_573,
   input  [31:0] cfg_pciephy_ctrl_574,
   input  [31:0] cfg_pciephy_ctrl_575,
   input  [31:0] cfg_pciephy_ctrl_576,
   input  [31:0] cfg_pciephy_ctrl_577,
   input  [31:0] cfg_pciephy_ctrl_578,
   input  [31:0] cfg_pciephy_ctrl_579,
   input  [31:0] cfg_pciephy_ctrl_580,
   input  [31:0] cfg_pciephy_ctrl_581,
   input  [31:0] cfg_pciephy_ctrl_582,
   input  [31:0] cfg_pciephy_ctrl_583,
   input  [31:0] cfg_pciephy_ctrl_584,
   input  [31:0] cfg_pciephy_ctrl_585,
   input  [31:0] cfg_pciephy_ctrl_586,
   input  [31:0] cfg_pciephy_ctrl_587,
   input  [31:0] cfg_pciephy_ctrl_588,
   input  [31:0] cfg_pciephy_ctrl_589
           );
        
           wire  reg_rd;
   wire  reg_wr;
   wire [11:0] reg_addr;
   reg [31:0] reg_rdata;
   wire [31:0] reg_wdata;
   wire [31:0] next_rdata;
   wire  in_range;
   wire  slverr;
   wire  dec_pciephy_ctrl_0;
   reg [31:0] reg_pciephy_ctrl_0;
   wire  pciephy_ctrl_0_we;
   wire  dec_pciephy_ctrl_1;
   reg [31:0] reg_pciephy_ctrl_1;
   wire  pciephy_ctrl_1_we;
   wire  dec_pciephy_ctrl_2;
   wire [31:0] reg_pciephy_ctrl_2;
   wire  dec_pciephy_ctrl_3;
   reg [31:0] reg_pciephy_ctrl_3;
   wire  pciephy_ctrl_3_we;
   wire  dec_pciephy_ctrl_4;
   reg [31:0] reg_pciephy_ctrl_4;
   wire  pciephy_ctrl_4_we;
   wire  dec_pciephy_ctrl_5;
   reg [31:0] reg_pciephy_ctrl_5;
   wire  pciephy_ctrl_5_we;
   wire  dec_pciephy_ctrl_6;
   reg [31:0] reg_pciephy_ctrl_6;
   wire  pciephy_ctrl_6_we;
   wire  dec_pciephy_ctrl_7;
   reg [31:0] reg_pciephy_ctrl_7;
   wire  pciephy_ctrl_7_we;
   wire  dec_pciephy_ctrl_8;
   reg [31:0] reg_pciephy_ctrl_8;
   wire  pciephy_ctrl_8_we;
   wire  dec_pciephy_ctrl_9;
   reg [31:0] reg_pciephy_ctrl_9;
   wire  pciephy_ctrl_9_we;
   wire  dec_pciephy_ctrl_10;
   reg [31:0] reg_pciephy_ctrl_10;
   wire  pciephy_ctrl_10_we;
   wire  dec_pciephy_ctrl_11;
   reg [31:0] reg_pciephy_ctrl_11;
   wire  pciephy_ctrl_11_we;
   wire  dec_pciephy_ctrl_12;
   reg [31:0] reg_pciephy_ctrl_12;
   wire  pciephy_ctrl_12_we;
   wire  dec_pciephy_ctrl_13;
   reg [31:0] reg_pciephy_ctrl_13;
   wire  pciephy_ctrl_13_we;
   wire  dec_pciephy_ctrl_14;
   reg [31:0] reg_pciephy_ctrl_14;
   wire  pciephy_ctrl_14_we;
   wire  dec_pciephy_ctrl_15;
   reg [31:0] reg_pciephy_ctrl_15;
   wire  pciephy_ctrl_15_we;
   wire  dec_pciephy_ctrl_16;
   reg [31:0] reg_pciephy_ctrl_16;
   wire  pciephy_ctrl_16_we;
   wire  dec_pciephy_ctrl_17;
   reg [31:0] reg_pciephy_ctrl_17;
   wire  pciephy_ctrl_17_we;
   wire  dec_pciephy_ctrl_18;
   reg [31:0] reg_pciephy_ctrl_18;
   wire  pciephy_ctrl_18_we;
   wire  dec_pciephy_ctrl_19;
   reg [31:0] reg_pciephy_ctrl_19;
   wire  pciephy_ctrl_19_we;
   wire  dec_pciephy_ctrl_20;
   reg [31:0] reg_pciephy_ctrl_20;
   wire  pciephy_ctrl_20_we;
   wire  dec_pciephy_ctrl_21;
   reg [31:0] reg_pciephy_ctrl_21;
   wire  pciephy_ctrl_21_we;
   wire  dec_pciephy_ctrl_22;
   reg [31:0] reg_pciephy_ctrl_22;
   wire  pciephy_ctrl_22_we;
   wire  dec_pciephy_ctrl_23;
   reg [31:0] reg_pciephy_ctrl_23;
   wire  pciephy_ctrl_23_we;
   wire  dec_pciephy_ctrl_24;
   reg [31:0] reg_pciephy_ctrl_24;
   wire  pciephy_ctrl_24_we;
   wire  dec_pciephy_ctrl_25;
   reg [31:0] reg_pciephy_ctrl_25;
   wire  pciephy_ctrl_25_we;
   wire  dec_pciephy_ctrl_26;
   reg [31:0] reg_pciephy_ctrl_26;
   wire  pciephy_ctrl_26_we;
   wire  dec_pciephy_ctrl_27;
   reg [31:0] reg_pciephy_ctrl_27;
   wire  pciephy_ctrl_27_we;
   wire  dec_pciephy_ctrl_28;
   reg [31:0] reg_pciephy_ctrl_28;
   wire  pciephy_ctrl_28_we;
   wire  dec_pciephy_ctrl_29;
   reg [31:0] reg_pciephy_ctrl_29;
   wire  pciephy_ctrl_29_we;
   wire  dec_pciephy_ctrl_30;
   reg [31:0] reg_pciephy_ctrl_30;
   wire  pciephy_ctrl_30_we;
   wire  dec_pciephy_ctrl_31;
   reg [31:0] reg_pciephy_ctrl_31;
   wire  pciephy_ctrl_31_we;
   wire  dec_pciephy_ctrl_32;
   reg [31:0] reg_pciephy_ctrl_32;
   wire  pciephy_ctrl_32_we;
   wire  dec_pciephy_ctrl_33;
   reg [31:0] reg_pciephy_ctrl_33;
   wire  pciephy_ctrl_33_we;
   wire  dec_pciephy_ctrl_34;
   reg [31:0] reg_pciephy_ctrl_34;
   wire  pciephy_ctrl_34_we;
   wire  dec_pciephy_ctrl_35;
   reg [31:0] reg_pciephy_ctrl_35;
   wire  pciephy_ctrl_35_we;
   wire  dec_pciephy_ctrl_36;
   reg [31:0] reg_pciephy_ctrl_36;
   wire  pciephy_ctrl_36_we;
   wire  dec_pciephy_ctrl_37;
   reg [31:0] reg_pciephy_ctrl_37;
   wire  pciephy_ctrl_37_we;
   wire  dec_pciephy_ctrl_38;
   reg [31:0] reg_pciephy_ctrl_38;
   wire  pciephy_ctrl_38_we;
   wire  dec_pciephy_ctrl_39;
   reg [31:0] reg_pciephy_ctrl_39;
   wire  pciephy_ctrl_39_we;
   wire  dec_pciephy_ctrl_40;
   reg [31:0] reg_pciephy_ctrl_40;
   wire  pciephy_ctrl_40_we;
   wire  dec_pciephy_ctrl_41;
   reg [31:0] reg_pciephy_ctrl_41;
   wire  pciephy_ctrl_41_we;
   wire  dec_pciephy_ctrl_42;
   reg [31:0] reg_pciephy_ctrl_42;
   wire  pciephy_ctrl_42_we;
   wire  dec_pciephy_ctrl_43;
   reg [31:0] reg_pciephy_ctrl_43;
   wire  pciephy_ctrl_43_we;
   wire  dec_pciephy_ctrl_44;
   reg [31:0] reg_pciephy_ctrl_44;
   wire  pciephy_ctrl_44_we;
   wire  dec_pciephy_ctrl_45;
   reg [31:0] reg_pciephy_ctrl_45;
   wire  pciephy_ctrl_45_we;
   wire  dec_pciephy_ctrl_46;
   reg [31:0] reg_pciephy_ctrl_46;
   wire  pciephy_ctrl_46_we;
   wire  dec_pciephy_ctrl_47;
   reg [31:0] reg_pciephy_ctrl_47;
   wire  pciephy_ctrl_47_we;
   wire  dec_pciephy_ctrl_48;
   reg [31:0] reg_pciephy_ctrl_48;
   wire  pciephy_ctrl_48_we;
   wire  dec_pciephy_ctrl_49;
   reg [31:0] reg_pciephy_ctrl_49;
   wire  pciephy_ctrl_49_we;
   wire  dec_pciephy_ctrl_50;
   reg [31:0] reg_pciephy_ctrl_50;
   wire  pciephy_ctrl_50_we;
   wire  dec_pciephy_ctrl_51;
   reg [31:0] reg_pciephy_ctrl_51;
   wire  pciephy_ctrl_51_we;
   wire  dec_pciephy_ctrl_52;
   reg [31:0] reg_pciephy_ctrl_52;
   wire  pciephy_ctrl_52_we;
   wire  dec_pciephy_ctrl_53;
   reg [31:0] reg_pciephy_ctrl_53;
   wire  pciephy_ctrl_53_we;
   wire  dec_pciephy_ctrl_54;
   reg [31:0] reg_pciephy_ctrl_54;
   wire  pciephy_ctrl_54_we;
   wire  dec_pciephy_ctrl_55;
   reg [31:0] reg_pciephy_ctrl_55;
   wire  pciephy_ctrl_55_we;
   wire  dec_pciephy_ctrl_56;
   reg [31:0] reg_pciephy_ctrl_56;
   wire  pciephy_ctrl_56_we;
   wire  dec_pciephy_ctrl_57;
   reg [31:0] reg_pciephy_ctrl_57;
   wire  pciephy_ctrl_57_we;
   wire  dec_pciephy_ctrl_58;
   reg [31:0] reg_pciephy_ctrl_58;
   wire  pciephy_ctrl_58_we;
   wire  dec_pciephy_ctrl_59;
   reg [31:0] reg_pciephy_ctrl_59;
   wire  pciephy_ctrl_59_we;
   wire  dec_pciephy_ctrl_60;
   reg [31:0] reg_pciephy_ctrl_60;
   wire  pciephy_ctrl_60_we;
   wire  dec_pciephy_ctrl_61;
   reg [31:0] reg_pciephy_ctrl_61;
   wire  pciephy_ctrl_61_we;
   wire  dec_pciephy_ctrl_62;
   reg [31:0] reg_pciephy_ctrl_62;
   wire  pciephy_ctrl_62_we;
   wire  dec_pciephy_ctrl_63;
   reg [31:0] reg_pciephy_ctrl_63;
   wire  pciephy_ctrl_63_we;
   wire  dec_pciephy_ctrl_64;
   reg [31:0] reg_pciephy_ctrl_64;
   wire  pciephy_ctrl_64_we;
   wire  dec_pciephy_ctrl_65;
   reg [31:0] reg_pciephy_ctrl_65;
   wire  pciephy_ctrl_65_we;
   wire  dec_pciephy_ctrl_66;
   reg [31:0] reg_pciephy_ctrl_66;
   wire  pciephy_ctrl_66_we;
   wire  dec_pciephy_ctrl_67;
   reg [31:0] reg_pciephy_ctrl_67;
   wire  pciephy_ctrl_67_we;
   wire  dec_pciephy_ctrl_68;
   reg [31:0] reg_pciephy_ctrl_68;
   wire  pciephy_ctrl_68_we;
   wire  dec_pciephy_ctrl_69;
   reg [31:0] reg_pciephy_ctrl_69;
   wire  pciephy_ctrl_69_we;
   wire  dec_pciephy_ctrl_70;
   reg [31:0] reg_pciephy_ctrl_70;
   wire  pciephy_ctrl_70_we;
   wire  dec_pciephy_ctrl_71;
   reg [31:0] reg_pciephy_ctrl_71;
   wire  pciephy_ctrl_71_we;
   wire  dec_pciephy_ctrl_72;
   reg [31:0] reg_pciephy_ctrl_72;
   wire  pciephy_ctrl_72_we;
   wire  dec_pciephy_ctrl_73;
   reg [31:0] reg_pciephy_ctrl_73;
   wire  pciephy_ctrl_73_we;
   wire  dec_pciephy_ctrl_74;
   reg [31:0] reg_pciephy_ctrl_74;
   wire  pciephy_ctrl_74_we;
   wire  dec_pciephy_ctrl_75;
   reg [31:0] reg_pciephy_ctrl_75;
   wire  pciephy_ctrl_75_we;
   wire  dec_pciephy_ctrl_76;
   reg [31:0] reg_pciephy_ctrl_76;
   wire  pciephy_ctrl_76_we;
   wire  dec_pciephy_ctrl_77;
   reg [31:0] reg_pciephy_ctrl_77;
   wire  pciephy_ctrl_77_we;
   wire  dec_pciephy_ctrl_78;
   reg [31:0] reg_pciephy_ctrl_78;
   wire  pciephy_ctrl_78_we;
   wire  dec_pciephy_ctrl_79;
   reg [31:0] reg_pciephy_ctrl_79;
   wire  pciephy_ctrl_79_we;
   wire  dec_pciephy_ctrl_80;
   reg [31:0] reg_pciephy_ctrl_80;
   wire  pciephy_ctrl_80_we;
   wire  dec_pciephy_ctrl_81;
   reg [31:0] reg_pciephy_ctrl_81;
   wire  pciephy_ctrl_81_we;
   wire  dec_pciephy_ctrl_82;
   reg [31:0] reg_pciephy_ctrl_82;
   wire  pciephy_ctrl_82_we;
   wire  dec_pciephy_ctrl_83;
   reg [31:0] reg_pciephy_ctrl_83;
   wire  pciephy_ctrl_83_we;
   wire  dec_pciephy_ctrl_84;
   reg [31:0] reg_pciephy_ctrl_84;
   wire  pciephy_ctrl_84_we;
   wire  dec_pciephy_ctrl_85;
   reg [31:0] reg_pciephy_ctrl_85;
   wire  pciephy_ctrl_85_we;
   wire  dec_pciephy_ctrl_86;
   reg [31:0] reg_pciephy_ctrl_86;
   wire  pciephy_ctrl_86_we;
   wire  dec_pciephy_ctrl_87;
   reg [31:0] reg_pciephy_ctrl_87;
   wire  pciephy_ctrl_87_we;
   wire  dec_pciephy_ctrl_88;
   reg [31:0] reg_pciephy_ctrl_88;
   wire  pciephy_ctrl_88_we;
   wire  dec_pciephy_ctrl_89;
   reg [31:0] reg_pciephy_ctrl_89;
   wire  pciephy_ctrl_89_we;
   wire  dec_pciephy_ctrl_90;
   reg [31:0] reg_pciephy_ctrl_90;
   wire  pciephy_ctrl_90_we;
   wire  dec_pciephy_ctrl_91;
   reg [31:0] reg_pciephy_ctrl_91;
   wire  pciephy_ctrl_91_we;
   wire  dec_pciephy_ctrl_92;
   reg [31:0] reg_pciephy_ctrl_92;
   wire  pciephy_ctrl_92_we;
   wire  dec_pciephy_ctrl_93;
   reg [31:0] reg_pciephy_ctrl_93;
   wire  pciephy_ctrl_93_we;
   wire  dec_pciephy_ctrl_94;
   reg [31:0] reg_pciephy_ctrl_94;
   wire  pciephy_ctrl_94_we;
   wire  dec_pciephy_ctrl_95;
   reg [31:0] reg_pciephy_ctrl_95;
   wire  pciephy_ctrl_95_we;
   wire  dec_pciephy_ctrl_96;
   reg [31:0] reg_pciephy_ctrl_96;
   wire  pciephy_ctrl_96_we;
   wire  dec_pciephy_ctrl_97;
   reg [31:0] reg_pciephy_ctrl_97;
   wire  pciephy_ctrl_97_we;
   wire  dec_pciephy_ctrl_98;
   reg [31:0] reg_pciephy_ctrl_98;
   wire  pciephy_ctrl_98_we;
   wire  dec_pciephy_ctrl_99;
   reg [31:0] reg_pciephy_ctrl_99;
   wire  pciephy_ctrl_99_we;
   wire  dec_pciephy_ctrl_100;
   reg [31:0] reg_pciephy_ctrl_100;
   wire  pciephy_ctrl_100_we;
   wire  dec_pciephy_ctrl_101;
   reg [31:0] reg_pciephy_ctrl_101;
   wire  pciephy_ctrl_101_we;
   wire  dec_pciephy_ctrl_102;
   reg [31:0] reg_pciephy_ctrl_102;
   wire  pciephy_ctrl_102_we;
   wire  dec_pciephy_ctrl_103;
   reg [31:0] reg_pciephy_ctrl_103;
   wire  pciephy_ctrl_103_we;
   wire  dec_pciephy_ctrl_104;
   reg [31:0] reg_pciephy_ctrl_104;
   wire  pciephy_ctrl_104_we;
   wire  dec_pciephy_ctrl_105;
   reg [31:0] reg_pciephy_ctrl_105;
   wire  pciephy_ctrl_105_we;
   wire  dec_pciephy_ctrl_106;
   reg [31:0] reg_pciephy_ctrl_106;
   wire  pciephy_ctrl_106_we;
   wire  dec_pciephy_ctrl_107;
   reg [31:0] reg_pciephy_ctrl_107;
   wire  pciephy_ctrl_107_we;
   wire  dec_pciephy_ctrl_108;
   reg [31:0] reg_pciephy_ctrl_108;
   wire  pciephy_ctrl_108_we;
   wire  dec_pciephy_ctrl_109;
   reg [31:0] reg_pciephy_ctrl_109;
   wire  pciephy_ctrl_109_we;
   wire  dec_pciephy_ctrl_110;
   reg [31:0] reg_pciephy_ctrl_110;
   wire  pciephy_ctrl_110_we;
   wire  dec_pciephy_ctrl_111;
   reg [31:0] reg_pciephy_ctrl_111;
   wire  pciephy_ctrl_111_we;
   wire  dec_pciephy_ctrl_112;
   reg [31:0] reg_pciephy_ctrl_112;
   wire  pciephy_ctrl_112_we;
   wire  dec_pciephy_ctrl_113;
   reg [31:0] reg_pciephy_ctrl_113;
   wire  pciephy_ctrl_113_we;
   wire  dec_pciephy_ctrl_114;
   reg [31:0] reg_pciephy_ctrl_114;
   wire  pciephy_ctrl_114_we;
   wire  dec_pciephy_ctrl_115;
   reg [31:0] reg_pciephy_ctrl_115;
   wire  pciephy_ctrl_115_we;
   wire  dec_pciephy_ctrl_116;
   reg [31:0] reg_pciephy_ctrl_116;
   wire  pciephy_ctrl_116_we;
   wire  dec_pciephy_ctrl_117;
   reg [31:0] reg_pciephy_ctrl_117;
   wire  pciephy_ctrl_117_we;
   wire  dec_pciephy_ctrl_118;
   reg [31:0] reg_pciephy_ctrl_118;
   wire  pciephy_ctrl_118_we;
   wire  dec_pciephy_ctrl_119;
   reg [31:0] reg_pciephy_ctrl_119;
   wire  pciephy_ctrl_119_we;
   wire  dec_pciephy_ctrl_120;
   reg [31:0] reg_pciephy_ctrl_120;
   wire  pciephy_ctrl_120_we;
   wire  dec_pciephy_ctrl_121;
   reg [31:0] reg_pciephy_ctrl_121;
   wire  pciephy_ctrl_121_we;
   wire  dec_pciephy_ctrl_122;
   reg [31:0] reg_pciephy_ctrl_122;
   wire  pciephy_ctrl_122_we;
   wire  dec_pciephy_ctrl_123;
   reg [31:0] reg_pciephy_ctrl_123;
   wire  pciephy_ctrl_123_we;
   wire  dec_pciephy_ctrl_124;
   reg [31:0] reg_pciephy_ctrl_124;
   wire  pciephy_ctrl_124_we;
   wire  dec_pciephy_ctrl_125;
   reg [31:0] reg_pciephy_ctrl_125;
   wire  pciephy_ctrl_125_we;
   wire  dec_pciephy_ctrl_126;
   reg [31:0] reg_pciephy_ctrl_126;
   wire  pciephy_ctrl_126_we;
   wire  dec_pciephy_ctrl_127;
   reg [31:0] reg_pciephy_ctrl_127;
   wire  pciephy_ctrl_127_we;
   wire  dec_pciephy_ctrl_128;
   reg [31:0] reg_pciephy_ctrl_128;
   wire  pciephy_ctrl_128_we;
   wire  dec_pciephy_ctrl_129;
   reg [31:0] reg_pciephy_ctrl_129;
   wire  pciephy_ctrl_129_we;
   wire  dec_pciephy_ctrl_130;
   reg [31:0] reg_pciephy_ctrl_130;
   wire  pciephy_ctrl_130_we;
   wire  dec_pciephy_ctrl_131;
   reg [31:0] reg_pciephy_ctrl_131;
   wire  pciephy_ctrl_131_we;
   wire  dec_pciephy_ctrl_132;
   reg [31:0] reg_pciephy_ctrl_132;
   wire  pciephy_ctrl_132_we;
   wire  dec_pciephy_ctrl_133;
   reg [31:0] reg_pciephy_ctrl_133;
   wire  pciephy_ctrl_133_we;
   wire  dec_pciephy_ctrl_134;
   reg [31:0] reg_pciephy_ctrl_134;
   wire  pciephy_ctrl_134_we;
   wire  dec_pciephy_ctrl_135;
   reg [31:0] reg_pciephy_ctrl_135;
   wire  pciephy_ctrl_135_we;
   wire  dec_pciephy_ctrl_136;
   reg [31:0] reg_pciephy_ctrl_136;
   wire  pciephy_ctrl_136_we;
   wire  dec_pciephy_ctrl_137;
   reg [31:0] reg_pciephy_ctrl_137;
   wire  pciephy_ctrl_137_we;
   wire  dec_pciephy_ctrl_138;
   reg [31:0] reg_pciephy_ctrl_138;
   wire  pciephy_ctrl_138_we;
   wire  dec_pciephy_ctrl_139;
   reg [31:0] reg_pciephy_ctrl_139;
   wire  pciephy_ctrl_139_we;
   wire  dec_pciephy_ctrl_140;
   reg [31:0] reg_pciephy_ctrl_140;
   wire  pciephy_ctrl_140_we;
   wire  dec_pciephy_ctrl_141;
   reg [31:0] reg_pciephy_ctrl_141;
   wire  pciephy_ctrl_141_we;
   wire  dec_pciephy_ctrl_142;
   reg [31:0] reg_pciephy_ctrl_142;
   wire  pciephy_ctrl_142_we;
   wire  dec_pciephy_ctrl_143;
   reg [31:0] reg_pciephy_ctrl_143;
   wire  pciephy_ctrl_143_we;
   wire  dec_pciephy_ctrl_144;
   reg [31:0] reg_pciephy_ctrl_144;
   wire  pciephy_ctrl_144_we;
   wire  dec_pciephy_ctrl_145;
   reg [31:0] reg_pciephy_ctrl_145;
   wire  pciephy_ctrl_145_we;
   wire  dec_pciephy_ctrl_146;
   reg [31:0] reg_pciephy_ctrl_146;
   wire  pciephy_ctrl_146_we;
   wire  dec_pciephy_ctrl_147;
   reg [31:0] reg_pciephy_ctrl_147;
   wire  pciephy_ctrl_147_we;
   wire  dec_pciephy_ctrl_148;
   reg [31:0] reg_pciephy_ctrl_148;
   wire  pciephy_ctrl_148_we;
   wire  dec_pciephy_ctrl_149;
   reg [31:0] reg_pciephy_ctrl_149;
   wire  pciephy_ctrl_149_we;
   wire  dec_pciephy_ctrl_150;
   reg [31:0] reg_pciephy_ctrl_150;
   wire  pciephy_ctrl_150_we;
   wire  dec_pciephy_ctrl_151;
   reg [31:0] reg_pciephy_ctrl_151;
   wire  pciephy_ctrl_151_we;
   wire  dec_pciephy_ctrl_152;
   reg [31:0] reg_pciephy_ctrl_152;
   wire  pciephy_ctrl_152_we;
   wire  dec_pciephy_ctrl_153;
   reg [31:0] reg_pciephy_ctrl_153;
   wire  pciephy_ctrl_153_we;
   wire  dec_pciephy_ctrl_154;
   reg [31:0] reg_pciephy_ctrl_154;
   wire  pciephy_ctrl_154_we;
   wire  dec_pciephy_ctrl_155;
   reg [31:0] reg_pciephy_ctrl_155;
   wire  pciephy_ctrl_155_we;
   wire  dec_pciephy_ctrl_156;
   reg [31:0] reg_pciephy_ctrl_156;
   wire  pciephy_ctrl_156_we;
   wire  dec_pciephy_ctrl_157;
   reg [31:0] reg_pciephy_ctrl_157;
   wire  pciephy_ctrl_157_we;
   wire  dec_pciephy_ctrl_158;
   reg [31:0] reg_pciephy_ctrl_158;
   wire  pciephy_ctrl_158_we;
   wire  dec_pciephy_ctrl_159;
   reg [31:0] reg_pciephy_ctrl_159;
   wire  pciephy_ctrl_159_we;
   wire  dec_pciephy_ctrl_160;
   reg [31:0] reg_pciephy_ctrl_160;
   wire  pciephy_ctrl_160_we;
   wire  dec_pciephy_ctrl_161;
   reg [31:0] reg_pciephy_ctrl_161;
   wire  pciephy_ctrl_161_we;
   wire  dec_pciephy_ctrl_162;
   reg [31:0] reg_pciephy_ctrl_162;
   wire  pciephy_ctrl_162_we;
   wire  dec_pciephy_ctrl_163;
   reg [31:0] reg_pciephy_ctrl_163;
   wire  pciephy_ctrl_163_we;
   wire  dec_pciephy_ctrl_164;
   reg [31:0] reg_pciephy_ctrl_164;
   wire  pciephy_ctrl_164_we;
   wire  dec_pciephy_ctrl_165;
   reg [31:0] reg_pciephy_ctrl_165;
   wire  pciephy_ctrl_165_we;
   wire  dec_pciephy_ctrl_166;
   reg [31:0] reg_pciephy_ctrl_166;
   wire  pciephy_ctrl_166_we;
   wire  dec_pciephy_ctrl_167;
   reg [31:0] reg_pciephy_ctrl_167;
   wire  pciephy_ctrl_167_we;
   wire  dec_pciephy_ctrl_168;
   reg [31:0] reg_pciephy_ctrl_168;
   wire  pciephy_ctrl_168_we;
   wire  dec_pciephy_ctrl_169;
   reg [31:0] reg_pciephy_ctrl_169;
   wire  pciephy_ctrl_169_we;
   wire  dec_pciephy_ctrl_170;
   reg [31:0] reg_pciephy_ctrl_170;
   wire  pciephy_ctrl_170_we;
   wire  dec_pciephy_ctrl_171;
   reg [31:0] reg_pciephy_ctrl_171;
   wire  pciephy_ctrl_171_we;
   wire  dec_pciephy_ctrl_172;
   reg [31:0] reg_pciephy_ctrl_172;
   wire  pciephy_ctrl_172_we;
   wire  dec_pciephy_ctrl_173;
   reg [31:0] reg_pciephy_ctrl_173;
   wire  pciephy_ctrl_173_we;
   wire  dec_pciephy_ctrl_174;
   reg [31:0] reg_pciephy_ctrl_174;
   wire  pciephy_ctrl_174_we;
   wire  dec_pciephy_ctrl_175;
   reg [31:0] reg_pciephy_ctrl_175;
   wire  pciephy_ctrl_175_we;
   wire  dec_pciephy_ctrl_176;
   reg [31:0] reg_pciephy_ctrl_176;
   wire  pciephy_ctrl_176_we;
   wire  dec_pciephy_ctrl_177;
   reg [31:0] reg_pciephy_ctrl_177;
   wire  pciephy_ctrl_177_we;
   wire  dec_pciephy_ctrl_178;
   reg [31:0] reg_pciephy_ctrl_178;
   wire  pciephy_ctrl_178_we;
   wire  dec_pciephy_ctrl_179;
   reg [31:0] reg_pciephy_ctrl_179;
   wire  pciephy_ctrl_179_we;
   wire  dec_pciephy_ctrl_180;
   reg [31:0] reg_pciephy_ctrl_180;
   wire  pciephy_ctrl_180_we;
   wire  dec_pciephy_ctrl_181;
   reg [31:0] reg_pciephy_ctrl_181;
   wire  pciephy_ctrl_181_we;
   wire  dec_pciephy_ctrl_182;
   reg [31:0] reg_pciephy_ctrl_182;
   wire  pciephy_ctrl_182_we;
   wire  dec_pciephy_ctrl_183;
   reg [31:0] reg_pciephy_ctrl_183;
   wire  pciephy_ctrl_183_we;
   wire  dec_pciephy_ctrl_184;
   reg [31:0] reg_pciephy_ctrl_184;
   wire  pciephy_ctrl_184_we;
   wire  dec_pciephy_ctrl_185;
   reg [31:0] reg_pciephy_ctrl_185;
   wire  pciephy_ctrl_185_we;
   wire  dec_pciephy_ctrl_186;
   reg [31:0] reg_pciephy_ctrl_186;
   wire  pciephy_ctrl_186_we;
   wire  dec_pciephy_ctrl_187;
   reg [31:0] reg_pciephy_ctrl_187;
   wire  pciephy_ctrl_187_we;
   wire  dec_pciephy_ctrl_188;
   reg [31:0] reg_pciephy_ctrl_188;
   wire  pciephy_ctrl_188_we;
   wire  dec_pciephy_ctrl_189;
   reg [31:0] reg_pciephy_ctrl_189;
   wire  pciephy_ctrl_189_we;
   wire  dec_pciephy_ctrl_190;
   reg [31:0] reg_pciephy_ctrl_190;
   wire  pciephy_ctrl_190_we;
   wire  dec_pciephy_ctrl_191;
   reg [31:0] reg_pciephy_ctrl_191;
   wire  pciephy_ctrl_191_we;
   wire  dec_pciephy_ctrl_192;
   reg [31:0] reg_pciephy_ctrl_192;
   wire  pciephy_ctrl_192_we;
   wire  dec_pciephy_ctrl_193;
   reg [31:0] reg_pciephy_ctrl_193;
   wire  pciephy_ctrl_193_we;
   wire  dec_pciephy_ctrl_194;
   reg [31:0] reg_pciephy_ctrl_194;
   wire  pciephy_ctrl_194_we;
   wire  dec_pciephy_ctrl_195;
   reg [31:0] reg_pciephy_ctrl_195;
   wire  pciephy_ctrl_195_we;
   wire  dec_pciephy_ctrl_196;
   reg [31:0] reg_pciephy_ctrl_196;
   wire  pciephy_ctrl_196_we;
   wire  dec_pciephy_ctrl_197;
   reg [31:0] reg_pciephy_ctrl_197;
   wire  pciephy_ctrl_197_we;
   wire  dec_pciephy_ctrl_198;
   reg [31:0] reg_pciephy_ctrl_198;
   wire  pciephy_ctrl_198_we;
   wire  dec_pciephy_ctrl_199;
   reg [31:0] reg_pciephy_ctrl_199;
   wire  pciephy_ctrl_199_we;
   wire  dec_pciephy_ctrl_200;
   reg [31:0] reg_pciephy_ctrl_200;
   wire  pciephy_ctrl_200_we;
   wire  dec_pciephy_ctrl_201;
   reg [31:0] reg_pciephy_ctrl_201;
   wire  pciephy_ctrl_201_we;
   wire  dec_pciephy_ctrl_202;
   reg [31:0] reg_pciephy_ctrl_202;
   wire  pciephy_ctrl_202_we;
   wire  dec_pciephy_ctrl_203;
   reg [31:0] reg_pciephy_ctrl_203;
   wire  pciephy_ctrl_203_we;
   wire  dec_pciephy_ctrl_204;
   reg [31:0] reg_pciephy_ctrl_204;
   wire  pciephy_ctrl_204_we;
   wire  dec_pciephy_ctrl_205;
   reg [31:0] reg_pciephy_ctrl_205;
   wire  pciephy_ctrl_205_we;
   wire  dec_pciephy_ctrl_206;
   reg [31:0] reg_pciephy_ctrl_206;
   wire  pciephy_ctrl_206_we;
   wire  dec_pciephy_ctrl_207;
   reg [31:0] reg_pciephy_ctrl_207;
   wire  pciephy_ctrl_207_we;
   wire  dec_pciephy_ctrl_208;
   reg [31:0] reg_pciephy_ctrl_208;
   wire  pciephy_ctrl_208_we;
   wire  dec_pciephy_ctrl_209;
   reg [31:0] reg_pciephy_ctrl_209;
   wire  pciephy_ctrl_209_we;
   wire  dec_pciephy_ctrl_210;
   reg [31:0] reg_pciephy_ctrl_210;
   wire  pciephy_ctrl_210_we;
   wire  dec_pciephy_ctrl_211;
   reg [31:0] reg_pciephy_ctrl_211;
   wire  pciephy_ctrl_211_we;
   wire  dec_pciephy_ctrl_212;
   reg [31:0] reg_pciephy_ctrl_212;
   wire  pciephy_ctrl_212_we;
   wire  dec_pciephy_ctrl_213;
   reg [31:0] reg_pciephy_ctrl_213;
   wire  pciephy_ctrl_213_we;
   wire  dec_pciephy_ctrl_214;
   reg [31:0] reg_pciephy_ctrl_214;
   wire  pciephy_ctrl_214_we;
   wire  dec_pciephy_ctrl_215;
   reg [31:0] reg_pciephy_ctrl_215;
   wire  pciephy_ctrl_215_we;
   wire  dec_pciephy_ctrl_216;
   reg [31:0] reg_pciephy_ctrl_216;
   wire  pciephy_ctrl_216_we;
   wire  dec_pciephy_ctrl_217;
   reg [31:0] reg_pciephy_ctrl_217;
   wire  pciephy_ctrl_217_we;
   wire  dec_pciephy_ctrl_218;
   reg [31:0] reg_pciephy_ctrl_218;
   wire  pciephy_ctrl_218_we;
   wire  dec_pciephy_ctrl_219;
   reg [31:0] reg_pciephy_ctrl_219;
   wire  pciephy_ctrl_219_we;
   wire  dec_pciephy_ctrl_220;
   reg [31:0] reg_pciephy_ctrl_220;
   wire  pciephy_ctrl_220_we;
   wire  dec_pciephy_ctrl_221;
   reg [31:0] reg_pciephy_ctrl_221;
   wire  pciephy_ctrl_221_we;
   wire  dec_pciephy_ctrl_222;
   reg [31:0] reg_pciephy_ctrl_222;
   wire  pciephy_ctrl_222_we;
   wire  dec_pciephy_ctrl_223;
   reg [31:0] reg_pciephy_ctrl_223;
   wire  pciephy_ctrl_223_we;
   wire  dec_pciephy_ctrl_224;
   reg [31:0] reg_pciephy_ctrl_224;
   wire  pciephy_ctrl_224_we;
   wire  dec_pciephy_ctrl_225;
   reg [31:0] reg_pciephy_ctrl_225;
   wire  pciephy_ctrl_225_we;
   wire  dec_pciephy_ctrl_226;
   reg [31:0] reg_pciephy_ctrl_226;
   wire  pciephy_ctrl_226_we;
   wire  dec_pciephy_ctrl_227;
   reg [31:0] reg_pciephy_ctrl_227;
   wire  pciephy_ctrl_227_we;
   wire  dec_pciephy_ctrl_228;
   reg [31:0] reg_pciephy_ctrl_228;
   wire  pciephy_ctrl_228_we;
   wire  dec_pciephy_ctrl_229;
   reg [31:0] reg_pciephy_ctrl_229;
   wire  pciephy_ctrl_229_we;
   wire  dec_pciephy_ctrl_230;
   reg [31:0] reg_pciephy_ctrl_230;
   wire  pciephy_ctrl_230_we;
   wire  dec_pciephy_ctrl_231;
   reg [31:0] reg_pciephy_ctrl_231;
   wire  pciephy_ctrl_231_we;
   wire  dec_pciephy_ctrl_232;
   reg [31:0] reg_pciephy_ctrl_232;
   wire  pciephy_ctrl_232_we;
   wire  dec_pciephy_ctrl_233;
   reg [31:0] reg_pciephy_ctrl_233;
   wire  pciephy_ctrl_233_we;
   wire  dec_pciephy_ctrl_234;
   reg [31:0] reg_pciephy_ctrl_234;
   wire  pciephy_ctrl_234_we;
   wire  dec_pciephy_ctrl_235;
   reg [31:0] reg_pciephy_ctrl_235;
   wire  pciephy_ctrl_235_we;
   wire  dec_pciephy_ctrl_236;
   reg [31:0] reg_pciephy_ctrl_236;
   wire  pciephy_ctrl_236_we;
   wire  dec_pciephy_ctrl_237;
   reg [31:0] reg_pciephy_ctrl_237;
   wire  pciephy_ctrl_237_we;
   wire  dec_pciephy_ctrl_238;
   reg [31:0] reg_pciephy_ctrl_238;
   wire  pciephy_ctrl_238_we;
   wire  dec_pciephy_ctrl_239;
   reg [31:0] reg_pciephy_ctrl_239;
   wire  pciephy_ctrl_239_we;
   wire  dec_pciephy_ctrl_240;
   reg [31:0] reg_pciephy_ctrl_240;
   wire  pciephy_ctrl_240_we;
   wire  dec_pciephy_ctrl_241;
   reg [31:0] reg_pciephy_ctrl_241;
   wire  pciephy_ctrl_241_we;
   wire  dec_pciephy_ctrl_242;
   reg [31:0] reg_pciephy_ctrl_242;
   wire  pciephy_ctrl_242_we;
   wire  dec_pciephy_ctrl_243;
   reg [31:0] reg_pciephy_ctrl_243;
   wire  pciephy_ctrl_243_we;
   wire  dec_pciephy_ctrl_244;
   reg [31:0] reg_pciephy_ctrl_244;
   wire  pciephy_ctrl_244_we;
   wire  dec_pciephy_ctrl_245;
   reg [31:0] reg_pciephy_ctrl_245;
   wire  pciephy_ctrl_245_we;
   wire  dec_pciephy_ctrl_246;
   reg [31:0] reg_pciephy_ctrl_246;
   wire  pciephy_ctrl_246_we;
   wire  dec_pciephy_ctrl_247;
   reg [31:0] reg_pciephy_ctrl_247;
   wire  pciephy_ctrl_247_we;
   wire  dec_pciephy_ctrl_248;
   reg [31:0] reg_pciephy_ctrl_248;
   wire  pciephy_ctrl_248_we;
   wire  dec_pciephy_ctrl_249;
   reg [31:0] reg_pciephy_ctrl_249;
   wire  pciephy_ctrl_249_we;
   wire  dec_pciephy_ctrl_250;
   reg [31:0] reg_pciephy_ctrl_250;
   wire  pciephy_ctrl_250_we;
   wire  dec_pciephy_ctrl_251;
   reg [31:0] reg_pciephy_ctrl_251;
   wire  pciephy_ctrl_251_we;
   wire  dec_pciephy_ctrl_252;
   reg [31:0] reg_pciephy_ctrl_252;
   wire  pciephy_ctrl_252_we;
   wire  dec_pciephy_ctrl_253;
   reg [31:0] reg_pciephy_ctrl_253;
   wire  pciephy_ctrl_253_we;
   wire  dec_pciephy_ctrl_254;
   reg [31:0] reg_pciephy_ctrl_254;
   wire  pciephy_ctrl_254_we;
   wire  dec_pciephy_ctrl_255;
   reg [31:0] reg_pciephy_ctrl_255;
   wire  pciephy_ctrl_255_we;
   wire  dec_pciephy_ctrl_256;
   reg [31:0] reg_pciephy_ctrl_256;
   wire  pciephy_ctrl_256_we;
   wire  dec_pciephy_ctrl_257;
   reg [31:0] reg_pciephy_ctrl_257;
   wire  pciephy_ctrl_257_we;
   wire  dec_pciephy_ctrl_258;
   reg [31:0] reg_pciephy_ctrl_258;
   wire  pciephy_ctrl_258_we;
   wire  dec_pciephy_ctrl_259;
   reg [31:0] reg_pciephy_ctrl_259;
   wire  pciephy_ctrl_259_we;
   wire  dec_pciephy_ctrl_260;
   reg [31:0] reg_pciephy_ctrl_260;
   wire  pciephy_ctrl_260_we;
   wire  dec_pciephy_ctrl_261;
   reg [31:0] reg_pciephy_ctrl_261;
   wire  pciephy_ctrl_261_we;
   wire  dec_pciephy_ctrl_262;
   reg [31:0] reg_pciephy_ctrl_262;
   wire  pciephy_ctrl_262_we;
   wire  dec_pciephy_ctrl_263;
   reg [31:0] reg_pciephy_ctrl_263;
   wire  pciephy_ctrl_263_we;
   wire  dec_pciephy_ctrl_264;
   reg [31:0] reg_pciephy_ctrl_264;
   wire  pciephy_ctrl_264_we;
   wire  dec_pciephy_ctrl_265;
   reg [31:0] reg_pciephy_ctrl_265;
   wire  pciephy_ctrl_265_we;
   wire  dec_pciephy_ctrl_266;
   reg [31:0] reg_pciephy_ctrl_266;
   wire  pciephy_ctrl_266_we;
   wire  dec_pciephy_ctrl_267;
   reg [31:0] reg_pciephy_ctrl_267;
   wire  pciephy_ctrl_267_we;
   wire  dec_pciephy_ctrl_268;
   reg [31:0] reg_pciephy_ctrl_268;
   wire  pciephy_ctrl_268_we;
   wire  dec_pciephy_ctrl_269;
   reg [31:0] reg_pciephy_ctrl_269;
   wire  pciephy_ctrl_269_we;
   wire  dec_pciephy_ctrl_270;
   reg [31:0] reg_pciephy_ctrl_270;
   wire  pciephy_ctrl_270_we;
   wire  dec_pciephy_ctrl_271;
   reg [31:0] reg_pciephy_ctrl_271;
   wire  pciephy_ctrl_271_we;
   wire  dec_pciephy_ctrl_272;
   reg [31:0] reg_pciephy_ctrl_272;
   wire  pciephy_ctrl_272_we;
   wire  dec_pciephy_ctrl_273;
   reg [31:0] reg_pciephy_ctrl_273;
   wire  pciephy_ctrl_273_we;
   wire  dec_pciephy_ctrl_274;
   reg [31:0] reg_pciephy_ctrl_274;
   wire  pciephy_ctrl_274_we;
   wire  dec_pciephy_ctrl_275;
   reg [31:0] reg_pciephy_ctrl_275;
   wire  pciephy_ctrl_275_we;
   wire  dec_pciephy_ctrl_276;
   reg [31:0] reg_pciephy_ctrl_276;
   wire  pciephy_ctrl_276_we;
   wire  dec_pciephy_ctrl_277;
   reg [31:0] reg_pciephy_ctrl_277;
   wire  pciephy_ctrl_277_we;
   wire  dec_pciephy_ctrl_278;
   reg [31:0] reg_pciephy_ctrl_278;
   wire  pciephy_ctrl_278_we;
   wire  dec_pciephy_ctrl_279;
   reg [31:0] reg_pciephy_ctrl_279;
   wire  pciephy_ctrl_279_we;
   wire  dec_pciephy_ctrl_280;
   reg [31:0] reg_pciephy_ctrl_280;
   wire  pciephy_ctrl_280_we;
   wire  dec_pciephy_ctrl_281;
   reg [31:0] reg_pciephy_ctrl_281;
   wire  pciephy_ctrl_281_we;
   wire  dec_pciephy_ctrl_282;
   reg [31:0] reg_pciephy_ctrl_282;
   wire  pciephy_ctrl_282_we;
   wire  dec_pciephy_ctrl_283;
   reg [31:0] reg_pciephy_ctrl_283;
   wire  pciephy_ctrl_283_we;
   wire  dec_pciephy_ctrl_284;
   reg [31:0] reg_pciephy_ctrl_284;
   wire  pciephy_ctrl_284_we;
   wire  dec_pciephy_ctrl_285;
   reg [31:0] reg_pciephy_ctrl_285;
   wire  pciephy_ctrl_285_we;
   wire  dec_pciephy_ctrl_286;
   reg [31:0] reg_pciephy_ctrl_286;
   wire  pciephy_ctrl_286_we;
   wire  dec_pciephy_ctrl_287;
   reg [31:0] reg_pciephy_ctrl_287;
   wire  pciephy_ctrl_287_we;
   wire  dec_pciephy_ctrl_288;
   reg [31:0] reg_pciephy_ctrl_288;
   wire  pciephy_ctrl_288_we;
   wire  dec_pciephy_ctrl_289;
   reg [31:0] reg_pciephy_ctrl_289;
   wire  pciephy_ctrl_289_we;
   wire  dec_pciephy_ctrl_290;
   reg [31:0] reg_pciephy_ctrl_290;
   wire  pciephy_ctrl_290_we;
   wire  dec_pciephy_ctrl_291;
   reg [31:0] reg_pciephy_ctrl_291;
   wire  pciephy_ctrl_291_we;
   wire  dec_pciephy_ctrl_292;
   reg [31:0] reg_pciephy_ctrl_292;
   wire  pciephy_ctrl_292_we;
   wire  dec_pciephy_ctrl_293;
   reg [31:0] reg_pciephy_ctrl_293;
   wire  pciephy_ctrl_293_we;
   wire  dec_pciephy_ctrl_294;
   reg [31:0] reg_pciephy_ctrl_294;
   wire  pciephy_ctrl_294_we;
   wire  dec_pciephy_ctrl_295;
   reg [31:0] reg_pciephy_ctrl_295;
   wire  pciephy_ctrl_295_we;
   wire  dec_pciephy_ctrl_296;
   reg [31:0] reg_pciephy_ctrl_296;
   wire  pciephy_ctrl_296_we;
   wire  dec_pciephy_ctrl_297;
   reg [31:0] reg_pciephy_ctrl_297;
   wire  pciephy_ctrl_297_we;
   wire  dec_pciephy_ctrl_298;
   reg [31:0] reg_pciephy_ctrl_298;
   wire  pciephy_ctrl_298_we;
   wire  dec_pciephy_ctrl_299;
   reg [31:0] reg_pciephy_ctrl_299;
   wire  pciephy_ctrl_299_we;
   wire  dec_pciephy_ctrl_300;
   reg [31:0] reg_pciephy_ctrl_300;
   wire  pciephy_ctrl_300_we;
   wire  dec_pciephy_ctrl_301;
   reg [31:0] reg_pciephy_ctrl_301;
   wire  pciephy_ctrl_301_we;
   wire  dec_pciephy_ctrl_302;
   reg [31:0] reg_pciephy_ctrl_302;
   wire  pciephy_ctrl_302_we;
   wire  dec_pciephy_ctrl_303;
   reg [31:0] reg_pciephy_ctrl_303;
   wire  pciephy_ctrl_303_we;
   wire  dec_pciephy_ctrl_304;
   reg [31:0] reg_pciephy_ctrl_304;
   wire  pciephy_ctrl_304_we;
   wire  dec_pciephy_ctrl_305;
   reg [31:0] reg_pciephy_ctrl_305;
   wire  pciephy_ctrl_305_we;
   wire  dec_pciephy_ctrl_306;
   reg [31:0] reg_pciephy_ctrl_306;
   wire  pciephy_ctrl_306_we;
   wire  dec_pciephy_ctrl_307;
   reg [31:0] reg_pciephy_ctrl_307;
   wire  pciephy_ctrl_307_we;
   wire  dec_pciephy_ctrl_308;
   reg [31:0] reg_pciephy_ctrl_308;
   wire  pciephy_ctrl_308_we;
   wire  dec_pciephy_ctrl_309;
   reg [31:0] reg_pciephy_ctrl_309;
   wire  pciephy_ctrl_309_we;
   wire  dec_pciephy_ctrl_310;
   reg [31:0] reg_pciephy_ctrl_310;
   wire  pciephy_ctrl_310_we;
   wire  dec_pciephy_ctrl_311;
   reg [31:0] reg_pciephy_ctrl_311;
   wire  pciephy_ctrl_311_we;
   wire  dec_pciephy_ctrl_312;
   reg [31:0] reg_pciephy_ctrl_312;
   wire  pciephy_ctrl_312_we;
   wire  dec_pciephy_ctrl_313;
   reg [31:0] reg_pciephy_ctrl_313;
   wire  pciephy_ctrl_313_we;
   wire  dec_pciephy_ctrl_314;
   reg [31:0] reg_pciephy_ctrl_314;
   wire  pciephy_ctrl_314_we;
   wire  dec_pciephy_ctrl_315;
   reg [31:0] reg_pciephy_ctrl_315;
   wire  pciephy_ctrl_315_we;
   wire  dec_pciephy_ctrl_316;
   reg [31:0] reg_pciephy_ctrl_316;
   wire  pciephy_ctrl_316_we;
   wire  dec_pciephy_ctrl_317;
   reg [31:0] reg_pciephy_ctrl_317;
   wire  pciephy_ctrl_317_we;
   wire  dec_pciephy_ctrl_318;
   reg [31:0] reg_pciephy_ctrl_318;
   wire  pciephy_ctrl_318_we;
   wire  dec_pciephy_ctrl_319;
   reg [31:0] reg_pciephy_ctrl_319;
   wire  pciephy_ctrl_319_we;
   wire  dec_pciephy_ctrl_320;
   reg [31:0] reg_pciephy_ctrl_320;
   wire  pciephy_ctrl_320_we;
   wire  dec_pciephy_ctrl_321;
   reg [31:0] reg_pciephy_ctrl_321;
   wire  pciephy_ctrl_321_we;
   wire  dec_pciephy_ctrl_322;
   reg [31:0] reg_pciephy_ctrl_322;
   wire  pciephy_ctrl_322_we;
   wire  dec_pciephy_ctrl_323;
   reg [31:0] reg_pciephy_ctrl_323;
   wire  pciephy_ctrl_323_we;
   wire  dec_pciephy_ctrl_324;
   reg [31:0] reg_pciephy_ctrl_324;
   wire  pciephy_ctrl_324_we;
   wire  dec_pciephy_ctrl_325;
   reg [31:0] reg_pciephy_ctrl_325;
   wire  pciephy_ctrl_325_we;
   wire  dec_pciephy_ctrl_326;
   reg [31:0] reg_pciephy_ctrl_326;
   wire  pciephy_ctrl_326_we;
   wire  dec_pciephy_ctrl_327;
   reg [31:0] reg_pciephy_ctrl_327;
   wire  pciephy_ctrl_327_we;
   wire  dec_pciephy_ctrl_328;
   reg [31:0] reg_pciephy_ctrl_328;
   wire  pciephy_ctrl_328_we;
   wire  dec_pciephy_ctrl_329;
   reg [31:0] reg_pciephy_ctrl_329;
   wire  pciephy_ctrl_329_we;
   wire  dec_pciephy_ctrl_330;
   reg [31:0] reg_pciephy_ctrl_330;
   wire  pciephy_ctrl_330_we;
   wire  dec_pciephy_ctrl_331;
   reg [31:0] reg_pciephy_ctrl_331;
   wire  pciephy_ctrl_331_we;
   wire  dec_pciephy_ctrl_332;
   reg [31:0] reg_pciephy_ctrl_332;
   wire  pciephy_ctrl_332_we;
   wire  dec_pciephy_ctrl_333;
   reg [31:0] reg_pciephy_ctrl_333;
   wire  pciephy_ctrl_333_we;
   wire  dec_pciephy_ctrl_334;
   reg [31:0] reg_pciephy_ctrl_334;
   wire  pciephy_ctrl_334_we;
   wire  dec_pciephy_ctrl_335;
   reg [31:0] reg_pciephy_ctrl_335;
   wire  pciephy_ctrl_335_we;
   wire  dec_pciephy_ctrl_336;
   reg [31:0] reg_pciephy_ctrl_336;
   wire  pciephy_ctrl_336_we;
   wire  dec_pciephy_ctrl_337;
   reg [31:0] reg_pciephy_ctrl_337;
   wire  pciephy_ctrl_337_we;
   wire  dec_pciephy_ctrl_338;
   reg [31:0] reg_pciephy_ctrl_338;
   wire  pciephy_ctrl_338_we;
   wire  dec_pciephy_ctrl_339;
   reg [31:0] reg_pciephy_ctrl_339;
   wire  pciephy_ctrl_339_we;
   wire  dec_pciephy_ctrl_340;
   reg [31:0] reg_pciephy_ctrl_340;
   wire  pciephy_ctrl_340_we;
   wire  dec_pciephy_ctrl_341;
   reg [31:0] reg_pciephy_ctrl_341;
   wire  pciephy_ctrl_341_we;
   wire  dec_pciephy_ctrl_342;
   reg [31:0] reg_pciephy_ctrl_342;
   wire  pciephy_ctrl_342_we;
   wire  dec_pciephy_ctrl_343;
   reg [31:0] reg_pciephy_ctrl_343;
   wire  pciephy_ctrl_343_we;
   wire  dec_pciephy_ctrl_344;
   reg [31:0] reg_pciephy_ctrl_344;
   wire  pciephy_ctrl_344_we;
   wire  dec_pciephy_ctrl_345;
   reg [31:0] reg_pciephy_ctrl_345;
   wire  pciephy_ctrl_345_we;
   wire  dec_pciephy_ctrl_346;
   reg [31:0] reg_pciephy_ctrl_346;
   wire  pciephy_ctrl_346_we;
   wire  dec_pciephy_ctrl_347;
   reg [31:0] reg_pciephy_ctrl_347;
   wire  pciephy_ctrl_347_we;
   wire  dec_pciephy_ctrl_348;
   reg [31:0] reg_pciephy_ctrl_348;
   wire  pciephy_ctrl_348_we;
   wire  dec_pciephy_ctrl_349;
   reg [31:0] reg_pciephy_ctrl_349;
   wire  pciephy_ctrl_349_we;
   wire  dec_pciephy_ctrl_350;
   reg [31:0] reg_pciephy_ctrl_350;
   wire  pciephy_ctrl_350_we;
   wire  dec_pciephy_ctrl_351;
   reg [31:0] reg_pciephy_ctrl_351;
   wire  pciephy_ctrl_351_we;
   wire  dec_pciephy_ctrl_352;
   reg [31:0] reg_pciephy_ctrl_352;
   wire  pciephy_ctrl_352_we;
   wire  dec_pciephy_ctrl_353;
   reg [31:0] reg_pciephy_ctrl_353;
   wire  pciephy_ctrl_353_we;
   wire  dec_pciephy_ctrl_354;
   reg [31:0] reg_pciephy_ctrl_354;
   wire  pciephy_ctrl_354_we;
   wire  dec_pciephy_ctrl_355;
   reg [31:0] reg_pciephy_ctrl_355;
   wire  pciephy_ctrl_355_we;
   wire  dec_pciephy_ctrl_356;
   reg [31:0] reg_pciephy_ctrl_356;
   wire  pciephy_ctrl_356_we;
   wire  dec_pciephy_ctrl_357;
   reg [31:0] reg_pciephy_ctrl_357;
   wire  pciephy_ctrl_357_we;
   wire  dec_pciephy_ctrl_358;
   reg [31:0] reg_pciephy_ctrl_358;
   wire  pciephy_ctrl_358_we;
   wire  dec_pciephy_ctrl_359;
   reg [31:0] reg_pciephy_ctrl_359;
   wire  pciephy_ctrl_359_we;
   wire  dec_pciephy_ctrl_360;
   reg [31:0] reg_pciephy_ctrl_360;
   wire  pciephy_ctrl_360_we;
   wire  dec_pciephy_ctrl_361;
   reg [31:0] reg_pciephy_ctrl_361;
   wire  pciephy_ctrl_361_we;
   wire  dec_pciephy_ctrl_362;
   reg [31:0] reg_pciephy_ctrl_362;
   wire  pciephy_ctrl_362_we;
   wire  dec_pciephy_ctrl_363;
   reg [31:0] reg_pciephy_ctrl_363;
   wire  pciephy_ctrl_363_we;
   wire  dec_pciephy_ctrl_364;
   reg [31:0] reg_pciephy_ctrl_364;
   wire  pciephy_ctrl_364_we;
   wire  dec_pciephy_ctrl_365;
   reg [31:0] reg_pciephy_ctrl_365;
   wire  pciephy_ctrl_365_we;
   wire  dec_pciephy_ctrl_366;
   reg [31:0] reg_pciephy_ctrl_366;
   wire  pciephy_ctrl_366_we;
   wire  dec_pciephy_ctrl_367;
   reg [31:0] reg_pciephy_ctrl_367;
   wire  pciephy_ctrl_367_we;
   wire  dec_pciephy_ctrl_368;
   reg [31:0] reg_pciephy_ctrl_368;
   wire  pciephy_ctrl_368_we;
   wire  dec_pciephy_ctrl_369;
   reg [31:0] reg_pciephy_ctrl_369;
   wire  pciephy_ctrl_369_we;
   wire  dec_pciephy_ctrl_370;
   reg [31:0] reg_pciephy_ctrl_370;
   wire  pciephy_ctrl_370_we;
   wire  dec_pciephy_ctrl_371;
   reg [31:0] reg_pciephy_ctrl_371;
   wire  pciephy_ctrl_371_we;
   wire  dec_pciephy_ctrl_372;
   reg [31:0] reg_pciephy_ctrl_372;
   wire  pciephy_ctrl_372_we;
   wire  dec_pciephy_ctrl_373;
   reg [31:0] reg_pciephy_ctrl_373;
   wire  pciephy_ctrl_373_we;
   wire  dec_pciephy_ctrl_374;
   reg [31:0] reg_pciephy_ctrl_374;
   wire  pciephy_ctrl_374_we;
   wire  dec_pciephy_ctrl_375;
   reg [31:0] reg_pciephy_ctrl_375;
   wire  pciephy_ctrl_375_we;
   wire  dec_pciephy_ctrl_376;
   reg [31:0] reg_pciephy_ctrl_376;
   wire  pciephy_ctrl_376_we;
   wire  dec_pciephy_ctrl_377;
   reg [31:0] reg_pciephy_ctrl_377;
   wire  pciephy_ctrl_377_we;
   wire  dec_pciephy_ctrl_378;
   reg [31:0] reg_pciephy_ctrl_378;
   wire  pciephy_ctrl_378_we;
   wire  dec_pciephy_ctrl_379;
   reg [31:0] reg_pciephy_ctrl_379;
   wire  pciephy_ctrl_379_we;
   wire  dec_pciephy_ctrl_380;
   reg [31:0] reg_pciephy_ctrl_380;
   wire  pciephy_ctrl_380_we;
   wire  dec_pciephy_ctrl_381;
   reg [31:0] reg_pciephy_ctrl_381;
   wire  pciephy_ctrl_381_we;
   wire  dec_pciephy_ctrl_382;
   reg [31:0] reg_pciephy_ctrl_382;
   wire  pciephy_ctrl_382_we;
   wire  dec_pciephy_ctrl_383;
   reg [31:0] reg_pciephy_ctrl_383;
   wire  pciephy_ctrl_383_we;
   wire  dec_pciephy_ctrl_384;
   reg [31:0] reg_pciephy_ctrl_384;
   wire  pciephy_ctrl_384_we;
   wire  dec_pciephy_ctrl_385;
   reg [31:0] reg_pciephy_ctrl_385;
   wire  pciephy_ctrl_385_we;
   wire  dec_pciephy_ctrl_386;
   reg [31:0] reg_pciephy_ctrl_386;
   wire  pciephy_ctrl_386_we;
   wire  dec_pciephy_ctrl_387;
   reg [31:0] reg_pciephy_ctrl_387;
   wire  pciephy_ctrl_387_we;
   wire  dec_pciephy_ctrl_388;
   reg [31:0] reg_pciephy_ctrl_388;
   wire  pciephy_ctrl_388_we;
   wire  dec_pciephy_ctrl_389;
   reg [31:0] reg_pciephy_ctrl_389;
   wire  pciephy_ctrl_389_we;
   wire  dec_pciephy_ctrl_390;
   reg [31:0] reg_pciephy_ctrl_390;
   wire  pciephy_ctrl_390_we;
   wire  dec_pciephy_ctrl_391;
   reg [31:0] reg_pciephy_ctrl_391;
   wire  pciephy_ctrl_391_we;
   wire  dec_pciephy_ctrl_392;
   reg [31:0] reg_pciephy_ctrl_392;
   wire  pciephy_ctrl_392_we;
   wire  dec_pciephy_ctrl_393;
   reg [31:0] reg_pciephy_ctrl_393;
   wire  pciephy_ctrl_393_we;
   wire  dec_pciephy_ctrl_394;
   reg [31:0] reg_pciephy_ctrl_394;
   wire  pciephy_ctrl_394_we;
   wire  dec_pciephy_ctrl_395;
   reg [31:0] reg_pciephy_ctrl_395;
   wire  pciephy_ctrl_395_we;
   wire  dec_pciephy_ctrl_396;
   reg [31:0] reg_pciephy_ctrl_396;
   wire  pciephy_ctrl_396_we;
   wire  dec_pciephy_ctrl_397;
   reg [31:0] reg_pciephy_ctrl_397;
   wire  pciephy_ctrl_397_we;
   wire  dec_pciephy_ctrl_398;
   reg [31:0] reg_pciephy_ctrl_398;
   wire  pciephy_ctrl_398_we;
   wire  dec_pciephy_ctrl_399;
   reg [31:0] reg_pciephy_ctrl_399;
   wire  pciephy_ctrl_399_we;
   wire  dec_pciephy_ctrl_400;
   reg [31:0] reg_pciephy_ctrl_400;
   wire  pciephy_ctrl_400_we;
   wire  dec_pciephy_ctrl_401;
   reg [31:0] reg_pciephy_ctrl_401;
   wire  pciephy_ctrl_401_we;
   wire  dec_pciephy_ctrl_402;
   reg [31:0] reg_pciephy_ctrl_402;
   wire  pciephy_ctrl_402_we;
   wire  dec_pciephy_ctrl_403;
   reg [31:0] reg_pciephy_ctrl_403;
   wire  pciephy_ctrl_403_we;
   wire  dec_pciephy_ctrl_404;
   reg [31:0] reg_pciephy_ctrl_404;
   wire  pciephy_ctrl_404_we;
   wire  dec_pciephy_ctrl_405;
   reg [31:0] reg_pciephy_ctrl_405;
   wire  pciephy_ctrl_405_we;
   wire  dec_pciephy_ctrl_406;
   reg [31:0] reg_pciephy_ctrl_406;
   wire  pciephy_ctrl_406_we;
   wire  dec_pciephy_ctrl_407;
   reg [31:0] reg_pciephy_ctrl_407;
   wire  pciephy_ctrl_407_we;
   wire  dec_pciephy_ctrl_408;
   reg [31:0] reg_pciephy_ctrl_408;
   wire  pciephy_ctrl_408_we;
   wire  dec_pciephy_ctrl_409;
   reg [31:0] reg_pciephy_ctrl_409;
   wire  pciephy_ctrl_409_we;
   wire  dec_pciephy_ctrl_410;
   reg [31:0] reg_pciephy_ctrl_410;
   wire  pciephy_ctrl_410_we;
   wire  dec_pciephy_ctrl_411;
   reg [31:0] reg_pciephy_ctrl_411;
   wire  pciephy_ctrl_411_we;
   wire  dec_pciephy_ctrl_412;
   reg [31:0] reg_pciephy_ctrl_412;
   wire  pciephy_ctrl_412_we;
   wire  dec_pciephy_ctrl_413;
   reg [31:0] reg_pciephy_ctrl_413;
   wire  pciephy_ctrl_413_we;
   wire  dec_pciephy_ctrl_414;
   reg [31:0] reg_pciephy_ctrl_414;
   wire  pciephy_ctrl_414_we;
   wire  dec_pciephy_ctrl_415;
   reg [31:0] reg_pciephy_ctrl_415;
   wire  pciephy_ctrl_415_we;
   wire  dec_pciephy_ctrl_416;
   reg [31:0] reg_pciephy_ctrl_416;
   wire  pciephy_ctrl_416_we;
   wire  dec_pciephy_ctrl_417;
   reg [31:0] reg_pciephy_ctrl_417;
   wire  pciephy_ctrl_417_we;
   wire  dec_pciephy_ctrl_418;
   reg [31:0] reg_pciephy_ctrl_418;
   wire  pciephy_ctrl_418_we;
   wire  dec_pciephy_ctrl_419;
   reg [31:0] reg_pciephy_ctrl_419;
   wire  pciephy_ctrl_419_we;
   wire  dec_pciephy_ctrl_420;
   reg [31:0] reg_pciephy_ctrl_420;
   wire  pciephy_ctrl_420_we;
   wire  dec_pciephy_ctrl_421;
   reg [31:0] reg_pciephy_ctrl_421;
   wire  pciephy_ctrl_421_we;
   wire  dec_pciephy_ctrl_422;
   reg [31:0] reg_pciephy_ctrl_422;
   wire  pciephy_ctrl_422_we;
   wire  dec_pciephy_ctrl_423;
   reg [31:0] reg_pciephy_ctrl_423;
   wire  pciephy_ctrl_423_we;
   wire  dec_pciephy_ctrl_424;
   reg [31:0] reg_pciephy_ctrl_424;
   wire  pciephy_ctrl_424_we;
   wire  dec_pciephy_ctrl_425;
   reg [31:0] reg_pciephy_ctrl_425;
   wire  pciephy_ctrl_425_we;
   wire  dec_pciephy_ctrl_426;
   reg [31:0] reg_pciephy_ctrl_426;
   wire  pciephy_ctrl_426_we;
   wire  dec_pciephy_ctrl_427;
   reg [31:0] reg_pciephy_ctrl_427;
   wire  pciephy_ctrl_427_we;
   wire  dec_pciephy_ctrl_428;
   reg [31:0] reg_pciephy_ctrl_428;
   wire  pciephy_ctrl_428_we;
   wire  dec_pciephy_ctrl_429;
   reg [31:0] reg_pciephy_ctrl_429;
   wire  pciephy_ctrl_429_we;
   wire  dec_pciephy_ctrl_430;
   reg [31:0] reg_pciephy_ctrl_430;
   wire  pciephy_ctrl_430_we;
   wire  dec_pciephy_ctrl_431;
   reg [31:0] reg_pciephy_ctrl_431;
   wire  pciephy_ctrl_431_we;
   wire  dec_pciephy_ctrl_432;
   reg [31:0] reg_pciephy_ctrl_432;
   wire  pciephy_ctrl_432_we;
   wire  dec_pciephy_ctrl_433;
   reg [31:0] reg_pciephy_ctrl_433;
   wire  pciephy_ctrl_433_we;
   wire  dec_pciephy_ctrl_434;
   reg [31:0] reg_pciephy_ctrl_434;
   wire  pciephy_ctrl_434_we;
   wire  dec_pciephy_ctrl_435;
   reg [31:0] reg_pciephy_ctrl_435;
   wire  pciephy_ctrl_435_we;
   wire  dec_pciephy_ctrl_436;
   reg [31:0] reg_pciephy_ctrl_436;
   wire  pciephy_ctrl_436_we;
   wire  dec_pciephy_ctrl_437;
   reg [31:0] reg_pciephy_ctrl_437;
   wire  pciephy_ctrl_437_we;
   wire  dec_pciephy_ctrl_438;
   reg [31:0] reg_pciephy_ctrl_438;
   wire  pciephy_ctrl_438_we;
   wire  dec_pciephy_ctrl_439;
   reg [31:0] reg_pciephy_ctrl_439;
   wire  pciephy_ctrl_439_we;
   wire  dec_pciephy_ctrl_440;
   reg [31:0] reg_pciephy_ctrl_440;
   wire  pciephy_ctrl_440_we;
   wire  dec_pciephy_ctrl_441;
   reg [31:0] reg_pciephy_ctrl_441;
   wire  pciephy_ctrl_441_we;
   wire  dec_pciephy_ctrl_442;
   reg [31:0] reg_pciephy_ctrl_442;
   wire  pciephy_ctrl_442_we;
   wire  dec_pciephy_ctrl_443;
   reg [31:0] reg_pciephy_ctrl_443;
   wire  pciephy_ctrl_443_we;
   wire  dec_pciephy_ctrl_444;
   reg [31:0] reg_pciephy_ctrl_444;
   wire  pciephy_ctrl_444_we;
   wire  dec_pciephy_ctrl_445;
   reg [31:0] reg_pciephy_ctrl_445;
   wire  pciephy_ctrl_445_we;
   wire  dec_pciephy_ctrl_446;
   reg [31:0] reg_pciephy_ctrl_446;
   wire  pciephy_ctrl_446_we;
   wire  dec_pciephy_ctrl_447;
   reg [31:0] reg_pciephy_ctrl_447;
   wire  pciephy_ctrl_447_we;
   wire  dec_pciephy_ctrl_448;
   reg [31:0] reg_pciephy_ctrl_448;
   wire  pciephy_ctrl_448_we;
   wire  dec_pciephy_ctrl_449;
   reg [31:0] reg_pciephy_ctrl_449;
   wire  pciephy_ctrl_449_we;
   wire  dec_pciephy_ctrl_450;
   reg [31:0] reg_pciephy_ctrl_450;
   wire  pciephy_ctrl_450_we;
   wire  dec_pciephy_ctrl_451;
   reg [31:0] reg_pciephy_ctrl_451;
   wire  pciephy_ctrl_451_we;
   wire  dec_pciephy_ctrl_452;
   reg [31:0] reg_pciephy_ctrl_452;
   wire  pciephy_ctrl_452_we;
   wire  dec_pciephy_ctrl_453;
   reg [31:0] reg_pciephy_ctrl_453;
   wire  pciephy_ctrl_453_we;
   wire  dec_pciephy_ctrl_454;
   reg [31:0] reg_pciephy_ctrl_454;
   wire  pciephy_ctrl_454_we;
   wire  dec_pciephy_ctrl_455;
   reg [31:0] reg_pciephy_ctrl_455;
   wire  pciephy_ctrl_455_we;
   wire  dec_pciephy_ctrl_456;
   reg [31:0] reg_pciephy_ctrl_456;
   wire  pciephy_ctrl_456_we;
   wire  dec_pciephy_ctrl_457;
   reg [31:0] reg_pciephy_ctrl_457;
   wire  pciephy_ctrl_457_we;
   wire  dec_pciephy_ctrl_458;
   reg [31:0] reg_pciephy_ctrl_458;
   wire  pciephy_ctrl_458_we;
   wire  dec_pciephy_ctrl_459;
   reg [31:0] reg_pciephy_ctrl_459;
   wire  pciephy_ctrl_459_we;
   wire  dec_pciephy_ctrl_460;
   reg [31:0] reg_pciephy_ctrl_460;
   wire  pciephy_ctrl_460_we;
   wire  dec_pciephy_ctrl_461;
   reg [31:0] reg_pciephy_ctrl_461;
   wire  pciephy_ctrl_461_we;
   wire  dec_pciephy_ctrl_462;
   reg [31:0] reg_pciephy_ctrl_462;
   wire  pciephy_ctrl_462_we;
   wire  dec_pciephy_ctrl_463;
   reg [31:0] reg_pciephy_ctrl_463;
   wire  pciephy_ctrl_463_we;
   wire  dec_pciephy_ctrl_464;
   reg [31:0] reg_pciephy_ctrl_464;
   wire  pciephy_ctrl_464_we;
   wire  dec_pciephy_ctrl_465;
   reg [31:0] reg_pciephy_ctrl_465;
   wire  pciephy_ctrl_465_we;
   wire  dec_pciephy_ctrl_466;
   reg [31:0] reg_pciephy_ctrl_466;
   wire  pciephy_ctrl_466_we;
   wire  dec_pciephy_ctrl_467;
   reg [31:0] reg_pciephy_ctrl_467;
   wire  pciephy_ctrl_467_we;
   wire  dec_pciephy_ctrl_468;
   reg [31:0] reg_pciephy_ctrl_468;
   wire  pciephy_ctrl_468_we;
   wire  dec_pciephy_ctrl_469;
   reg [31:0] reg_pciephy_ctrl_469;
   wire  pciephy_ctrl_469_we;
   wire  dec_pciephy_ctrl_470;
   reg [31:0] reg_pciephy_ctrl_470;
   wire  pciephy_ctrl_470_we;
   wire  dec_pciephy_ctrl_471;
   reg [31:0] reg_pciephy_ctrl_471;
   wire  pciephy_ctrl_471_we;
   wire  dec_pciephy_ctrl_472;
   reg [31:0] reg_pciephy_ctrl_472;
   wire  pciephy_ctrl_472_we;
   wire  dec_pciephy_ctrl_473;
   reg [31:0] reg_pciephy_ctrl_473;
   wire  pciephy_ctrl_473_we;
   wire  dec_pciephy_ctrl_474;
   reg [31:0] reg_pciephy_ctrl_474;
   wire  pciephy_ctrl_474_we;
   wire  dec_pciephy_ctrl_475;
   reg [31:0] reg_pciephy_ctrl_475;
   wire  pciephy_ctrl_475_we;
   wire  dec_pciephy_ctrl_476;
   reg [31:0] reg_pciephy_ctrl_476;
   wire  pciephy_ctrl_476_we;
   wire  dec_pciephy_ctrl_477;
   reg [31:0] reg_pciephy_ctrl_477;
   wire  pciephy_ctrl_477_we;
   wire  dec_pciephy_ctrl_478;
   reg [31:0] reg_pciephy_ctrl_478;
   wire  pciephy_ctrl_478_we;
   wire  dec_pciephy_ctrl_479;
   reg [31:0] reg_pciephy_ctrl_479;
   wire  pciephy_ctrl_479_we;
   wire  dec_pciephy_ctrl_480;
   reg [31:0] reg_pciephy_ctrl_480;
   wire  pciephy_ctrl_480_we;
   wire  dec_pciephy_ctrl_481;
   reg [31:0] reg_pciephy_ctrl_481;
   wire  pciephy_ctrl_481_we;
   wire  dec_pciephy_ctrl_482;
   reg [31:0] reg_pciephy_ctrl_482;
   wire  pciephy_ctrl_482_we;
   wire  dec_pciephy_ctrl_483;
   reg [31:0] reg_pciephy_ctrl_483;
   wire  pciephy_ctrl_483_we;
   wire  dec_pciephy_ctrl_484;
   reg [31:0] reg_pciephy_ctrl_484;
   wire  pciephy_ctrl_484_we;
   wire  dec_pciephy_ctrl_485;
   reg [31:0] reg_pciephy_ctrl_485;
   wire  pciephy_ctrl_485_we;
   wire  dec_pciephy_ctrl_486;
   reg [31:0] reg_pciephy_ctrl_486;
   wire  pciephy_ctrl_486_we;
   wire  dec_pciephy_ctrl_487;
   reg [31:0] reg_pciephy_ctrl_487;
   wire  pciephy_ctrl_487_we;
   wire  dec_pciephy_ctrl_488;
   reg [31:0] reg_pciephy_ctrl_488;
   wire  pciephy_ctrl_488_we;
   wire  dec_pciephy_ctrl_489;
   reg [31:0] reg_pciephy_ctrl_489;
   wire  pciephy_ctrl_489_we;
   wire  dec_pciephy_ctrl_490;
   reg [31:0] reg_pciephy_ctrl_490;
   wire  pciephy_ctrl_490_we;
   wire  dec_pciephy_ctrl_491;
   reg [31:0] reg_pciephy_ctrl_491;
   wire  pciephy_ctrl_491_we;
   wire  dec_pciephy_ctrl_492;
   reg [31:0] reg_pciephy_ctrl_492;
   wire  pciephy_ctrl_492_we;
   wire  dec_pciephy_ctrl_493;
   reg [31:0] reg_pciephy_ctrl_493;
   wire  pciephy_ctrl_493_we;
   wire  dec_pciephy_ctrl_494;
   reg [31:0] reg_pciephy_ctrl_494;
   wire  pciephy_ctrl_494_we;
   wire  dec_pciephy_ctrl_495;
   reg [31:0] reg_pciephy_ctrl_495;
   wire  pciephy_ctrl_495_we;
   wire  dec_pciephy_ctrl_496;
   reg [31:0] reg_pciephy_ctrl_496;
   wire  pciephy_ctrl_496_we;
   wire  dec_pciephy_ctrl_497;
   reg [31:0] reg_pciephy_ctrl_497;
   wire  pciephy_ctrl_497_we;
   wire  dec_pciephy_ctrl_498;
   reg [31:0] reg_pciephy_ctrl_498;
   wire  pciephy_ctrl_498_we;
   wire  dec_pciephy_ctrl_499;
   reg [31:0] reg_pciephy_ctrl_499;
   wire  pciephy_ctrl_499_we;
   wire  dec_pciephy_ctrl_500;
   reg [31:0] reg_pciephy_ctrl_500;
   wire  pciephy_ctrl_500_we;
   wire  dec_pciephy_ctrl_501;
   reg [31:0] reg_pciephy_ctrl_501;
   wire  pciephy_ctrl_501_we;
   wire  dec_pciephy_ctrl_502;
   reg [31:0] reg_pciephy_ctrl_502;
   wire  pciephy_ctrl_502_we;
   wire  dec_pciephy_ctrl_503;
   reg [31:0] reg_pciephy_ctrl_503;
   wire  pciephy_ctrl_503_we;
   wire  dec_pciephy_ctrl_504;
   reg [31:0] reg_pciephy_ctrl_504;
   wire  pciephy_ctrl_504_we;
   wire  dec_pciephy_ctrl_505;
   reg [31:0] reg_pciephy_ctrl_505;
   wire  pciephy_ctrl_505_we;
   wire  dec_pciephy_ctrl_506;
   reg [31:0] reg_pciephy_ctrl_506;
   wire  pciephy_ctrl_506_we;
   wire  dec_pciephy_ctrl_507;
   reg [31:0] reg_pciephy_ctrl_507;
   wire  pciephy_ctrl_507_we;
   wire  dec_pciephy_ctrl_508;
   reg [31:0] reg_pciephy_ctrl_508;
   wire  pciephy_ctrl_508_we;
   wire  dec_pciephy_ctrl_509;
   reg [31:0] reg_pciephy_ctrl_509;
   wire  pciephy_ctrl_509_we;
   wire  dec_pciephy_ctrl_510;
   reg [31:0] reg_pciephy_ctrl_510;
   wire  pciephy_ctrl_510_we;
   wire  dec_pciephy_ctrl_511;
   reg [31:0] reg_pciephy_ctrl_511;
   wire  pciephy_ctrl_511_we;
   wire  dec_pciephy_ctrl_512;
   reg [31:0] reg_pciephy_ctrl_512;
   wire  pciephy_ctrl_512_we;
   wire  dec_pciephy_ctrl_513;
   reg [31:0] reg_pciephy_ctrl_513;
   wire  pciephy_ctrl_513_we;
   wire  dec_pciephy_ctrl_514;
   reg [31:0] reg_pciephy_ctrl_514;
   wire  pciephy_ctrl_514_we;
   wire  dec_pciephy_ctrl_515;
   reg [31:0] reg_pciephy_ctrl_515;
   wire  pciephy_ctrl_515_we;
   wire  dec_pciephy_ctrl_516;
   reg [31:0] reg_pciephy_ctrl_516;
   wire  pciephy_ctrl_516_we;
   wire  dec_pciephy_ctrl_517;
   reg [31:0] reg_pciephy_ctrl_517;
   wire  pciephy_ctrl_517_we;
   wire  dec_pciephy_ctrl_518;
   reg [31:0] reg_pciephy_ctrl_518;
   wire  pciephy_ctrl_518_we;
   wire  dec_pciephy_ctrl_519;
   reg [31:0] reg_pciephy_ctrl_519;
   wire  pciephy_ctrl_519_we;
   wire  dec_pciephy_ctrl_520;
   reg [31:0] reg_pciephy_ctrl_520;
   wire  pciephy_ctrl_520_we;
   wire  dec_pciephy_ctrl_521;
   reg [31:0] reg_pciephy_ctrl_521;
   wire  pciephy_ctrl_521_we;
   wire  dec_pciephy_ctrl_522;
   reg [31:0] reg_pciephy_ctrl_522;
   wire  pciephy_ctrl_522_we;
   wire  dec_pciephy_ctrl_523;
   reg [31:0] reg_pciephy_ctrl_523;
   wire  pciephy_ctrl_523_we;
   wire  dec_pciephy_ctrl_524;
   reg [31:0] reg_pciephy_ctrl_524;
   wire  pciephy_ctrl_524_we;
   wire  dec_pciephy_ctrl_525;
   reg [31:0] reg_pciephy_ctrl_525;
   wire  pciephy_ctrl_525_we;
   wire  dec_pciephy_ctrl_526;
   reg [31:0] reg_pciephy_ctrl_526;
   wire  pciephy_ctrl_526_we;
   wire  dec_pciephy_ctrl_527;
   reg [31:0] reg_pciephy_ctrl_527;
   wire  pciephy_ctrl_527_we;
   wire  dec_pciephy_ctrl_528;
   reg [31:0] reg_pciephy_ctrl_528;
   wire  pciephy_ctrl_528_we;
   wire  dec_pciephy_ctrl_529;
   reg [31:0] reg_pciephy_ctrl_529;
   wire  pciephy_ctrl_529_we;
   wire  dec_pciephy_ctrl_530;
   reg [31:0] reg_pciephy_ctrl_530;
   wire  pciephy_ctrl_530_we;
   wire  dec_pciephy_ctrl_531;
   reg [31:0] reg_pciephy_ctrl_531;
   wire  pciephy_ctrl_531_we;
   wire  dec_pciephy_ctrl_532;
   reg [31:0] reg_pciephy_ctrl_532;
   wire  pciephy_ctrl_532_we;
   wire  dec_pciephy_ctrl_533;
   reg [31:0] reg_pciephy_ctrl_533;
   wire  pciephy_ctrl_533_we;
   wire  dec_pciephy_ctrl_534;
   reg [31:0] reg_pciephy_ctrl_534;
   wire  pciephy_ctrl_534_we;
   wire  dec_pciephy_ctrl_535;
   reg [31:0] reg_pciephy_ctrl_535;
   wire  pciephy_ctrl_535_we;
   wire  dec_pciephy_ctrl_536;
   reg [31:0] reg_pciephy_ctrl_536;
   wire  pciephy_ctrl_536_we;
   wire  dec_pciephy_ctrl_537;
   reg [31:0] reg_pciephy_ctrl_537;
   wire  pciephy_ctrl_537_we;
   wire  dec_pciephy_ctrl_538;
   reg [31:0] reg_pciephy_ctrl_538;
   wire  pciephy_ctrl_538_we;
   wire  dec_pciephy_ctrl_539;
   reg [31:0] reg_pciephy_ctrl_539;
   wire  pciephy_ctrl_539_we;
   wire  dec_pciephy_ctrl_540;
   reg [31:0] reg_pciephy_ctrl_540;
   wire  pciephy_ctrl_540_we;
   wire  dec_pciephy_ctrl_541;
   reg [31:0] reg_pciephy_ctrl_541;
   wire  pciephy_ctrl_541_we;
   wire  dec_pciephy_ctrl_542;
   reg [31:0] reg_pciephy_ctrl_542;
   wire  pciephy_ctrl_542_we;
   wire  dec_pciephy_ctrl_543;
   reg [31:0] reg_pciephy_ctrl_543;
   wire  pciephy_ctrl_543_we;
   wire  dec_pciephy_ctrl_544;
   reg [31:0] reg_pciephy_ctrl_544;
   wire  pciephy_ctrl_544_we;
   wire  dec_pciephy_ctrl_545;
   reg [31:0] reg_pciephy_ctrl_545;
   wire  pciephy_ctrl_545_we;
   wire  dec_pciephy_ctrl_546;
   reg [31:0] reg_pciephy_ctrl_546;
   wire  pciephy_ctrl_546_we;
   wire  dec_pciephy_ctrl_547;
   reg [31:0] reg_pciephy_ctrl_547;
   wire  pciephy_ctrl_547_we;
   wire  dec_pciephy_ctrl_548;
   reg [31:0] reg_pciephy_ctrl_548;
   wire  pciephy_ctrl_548_we;
   wire  dec_pciephy_ctrl_549;
   reg [31:0] reg_pciephy_ctrl_549;
   wire  pciephy_ctrl_549_we;
   wire  dec_pciephy_ctrl_550;
   reg [31:0] reg_pciephy_ctrl_550;
   wire  pciephy_ctrl_550_we;
   wire  dec_pciephy_ctrl_551;
   reg [31:0] reg_pciephy_ctrl_551;
   wire  pciephy_ctrl_551_we;
   wire  dec_pciephy_ctrl_552;
   reg [31:0] reg_pciephy_ctrl_552;
   wire  pciephy_ctrl_552_we;
   wire  dec_pciephy_ctrl_553;
   reg [31:0] reg_pciephy_ctrl_553;
   wire  pciephy_ctrl_553_we;
   wire  dec_pciephy_ctrl_554;
   reg [31:0] reg_pciephy_ctrl_554;
   wire  pciephy_ctrl_554_we;
   wire  dec_pciephy_ctrl_555;
   reg [31:0] reg_pciephy_ctrl_555;
   wire  pciephy_ctrl_555_we;
   wire  dec_pciephy_ctrl_556;
   reg [31:0] reg_pciephy_ctrl_556;
   wire  pciephy_ctrl_556_we;
   wire  dec_pciephy_ctrl_557;
   reg [31:0] reg_pciephy_ctrl_557;
   wire  pciephy_ctrl_557_we;
   wire  dec_pciephy_ctrl_558;
   reg [31:0] reg_pciephy_ctrl_558;
   wire  pciephy_ctrl_558_we;
   wire  dec_pciephy_ctrl_559;
   reg [31:0] reg_pciephy_ctrl_559;
   wire  pciephy_ctrl_559_we;
   wire  dec_pciephy_ctrl_560;
   reg [31:0] reg_pciephy_ctrl_560;
   wire  pciephy_ctrl_560_we;
   wire  dec_pciephy_ctrl_561;
   reg [31:0] reg_pciephy_ctrl_561;
   wire  pciephy_ctrl_561_we;
   wire  dec_pciephy_ctrl_562;
   reg [31:0] reg_pciephy_ctrl_562;
   wire  pciephy_ctrl_562_we;
   wire  dec_pciephy_ctrl_563;
   reg [31:0] reg_pciephy_ctrl_563;
   wire  pciephy_ctrl_563_we;
   wire  dec_pciephy_ctrl_564;
   reg [31:0] reg_pciephy_ctrl_564;
   wire  pciephy_ctrl_564_we;
   wire  dec_pciephy_ctrl_565;
   wire [31:0] reg_pciephy_ctrl_565;
   wire  dec_pciephy_ctrl_566;
   wire [31:0] reg_pciephy_ctrl_566;
   wire  dec_pciephy_ctrl_567;
   wire [31:0] reg_pciephy_ctrl_567;
   wire  dec_pciephy_ctrl_568;
   wire [31:0] reg_pciephy_ctrl_568;
   wire  dec_pciephy_ctrl_569;
   wire [31:0] reg_pciephy_ctrl_569;
   wire  dec_pciephy_ctrl_570;
   wire [31:0] reg_pciephy_ctrl_570;
   wire  dec_pciephy_ctrl_571;
   wire [31:0] reg_pciephy_ctrl_571;
   wire  dec_pciephy_ctrl_572;
   wire [31:0] reg_pciephy_ctrl_572;
   wire  dec_pciephy_ctrl_573;
   wire [31:0] reg_pciephy_ctrl_573;
   wire  dec_pciephy_ctrl_574;
   wire [31:0] reg_pciephy_ctrl_574;
   wire  dec_pciephy_ctrl_575;
   wire [31:0] reg_pciephy_ctrl_575;
   wire  dec_pciephy_ctrl_576;
   wire [31:0] reg_pciephy_ctrl_576;
   wire  dec_pciephy_ctrl_577;
   wire [31:0] reg_pciephy_ctrl_577;
   wire  dec_pciephy_ctrl_578;
   wire [31:0] reg_pciephy_ctrl_578;
   wire  dec_pciephy_ctrl_579;
   wire [31:0] reg_pciephy_ctrl_579;
   wire  dec_pciephy_ctrl_580;
   wire [31:0] reg_pciephy_ctrl_580;
   wire  dec_pciephy_ctrl_581;
   wire [31:0] reg_pciephy_ctrl_581;
   wire  dec_pciephy_ctrl_582;
   wire [31:0] reg_pciephy_ctrl_582;
   wire  dec_pciephy_ctrl_583;
   wire [31:0] reg_pciephy_ctrl_583;
   wire  dec_pciephy_ctrl_584;
   wire [31:0] reg_pciephy_ctrl_584;
   wire  dec_pciephy_ctrl_585;
   wire [31:0] reg_pciephy_ctrl_585;
   wire  dec_pciephy_ctrl_586;
   wire [31:0] reg_pciephy_ctrl_586;
   wire  dec_pciephy_ctrl_587;
   wire [31:0] reg_pciephy_ctrl_587;
   wire  dec_pciephy_ctrl_588;
   wire [31:0] reg_pciephy_ctrl_588;
   wire  dec_pciephy_ctrl_589;
   wire [31:0] reg_pciephy_ctrl_589;
        
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

    
        
    
        
always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    pslverr <= 1'h0;
      end
  else
  begin
  pslverr <= slverr;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_0 <= 32'h0;
      end
  else if(pciephy_ctrl_0_we)
  begin
  reg_pciephy_ctrl_0 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_1 <= 32'hFFFF;
      end
  else if(pciephy_ctrl_1_we)
  begin
  reg_pciephy_ctrl_1 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_3 <= 32'h2111088;
      end
  else if(pciephy_ctrl_3_we)
  begin
  reg_pciephy_ctrl_3 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_4 <= 32'h3117C104;
      end
  else if(pciephy_ctrl_4_we)
  begin
  reg_pciephy_ctrl_4 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_5 <= 32'h1800000;
      end
  else if(pciephy_ctrl_5_we)
  begin
  reg_pciephy_ctrl_5 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_6 <= 32'h33;
      end
  else if(pciephy_ctrl_6_we)
  begin
  reg_pciephy_ctrl_6 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_7 <= 32'h3117C104;
      end
  else if(pciephy_ctrl_7_we)
  begin
  reg_pciephy_ctrl_7 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_8 <= 32'h1800000;
      end
  else if(pciephy_ctrl_8_we)
  begin
  reg_pciephy_ctrl_8 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_9 <= 32'h33;
      end
  else if(pciephy_ctrl_9_we)
  begin
  reg_pciephy_ctrl_9 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_10 <= 32'h3117C104;
      end
  else if(pciephy_ctrl_10_we)
  begin
  reg_pciephy_ctrl_10 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_11 <= 32'h1800000;
      end
  else if(pciephy_ctrl_11_we)
  begin
  reg_pciephy_ctrl_11 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_12 <= 32'h33;
      end
  else if(pciephy_ctrl_12_we)
  begin
  reg_pciephy_ctrl_12 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_13 <= 32'h3117C104;
      end
  else if(pciephy_ctrl_13_we)
  begin
  reg_pciephy_ctrl_13 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_14 <= 32'h1800000;
      end
  else if(pciephy_ctrl_14_we)
  begin
  reg_pciephy_ctrl_14 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_15 <= 32'h33;
      end
  else if(pciephy_ctrl_15_we)
  begin
  reg_pciephy_ctrl_15 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_16 <= 32'h18C6318C;
      end
  else if(pciephy_ctrl_16_we)
  begin
  reg_pciephy_ctrl_16 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_17 <= 32'h18C6318C;
      end
  else if(pciephy_ctrl_17_we)
  begin
  reg_pciephy_ctrl_17 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_18 <= 32'h116318C;
      end
  else if(pciephy_ctrl_18_we)
  begin
  reg_pciephy_ctrl_18 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_19 <= 32'h1;
      end
  else if(pciephy_ctrl_19_we)
  begin
  reg_pciephy_ctrl_19 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_20 <= 32'h0;
      end
  else if(pciephy_ctrl_20_we)
  begin
  reg_pciephy_ctrl_20 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_21 <= 32'h1;
      end
  else if(pciephy_ctrl_21_we)
  begin
  reg_pciephy_ctrl_21 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_22 <= 32'h0;
      end
  else if(pciephy_ctrl_22_we)
  begin
  reg_pciephy_ctrl_22 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_23 <= 32'h1;
      end
  else if(pciephy_ctrl_23_we)
  begin
  reg_pciephy_ctrl_23 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_24 <= 32'h0;
      end
  else if(pciephy_ctrl_24_we)
  begin
  reg_pciephy_ctrl_24 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_25 <= 32'h1;
      end
  else if(pciephy_ctrl_25_we)
  begin
  reg_pciephy_ctrl_25 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_26 <= 32'h0;
      end
  else if(pciephy_ctrl_26_we)
  begin
  reg_pciephy_ctrl_26 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_27 <= 32'h1;
      end
  else if(pciephy_ctrl_27_we)
  begin
  reg_pciephy_ctrl_27 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_28 <= 32'h0;
      end
  else if(pciephy_ctrl_28_we)
  begin
  reg_pciephy_ctrl_28 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_29 <= 32'h1;
      end
  else if(pciephy_ctrl_29_we)
  begin
  reg_pciephy_ctrl_29 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_30 <= 32'h0;
      end
  else if(pciephy_ctrl_30_we)
  begin
  reg_pciephy_ctrl_30 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_31 <= 32'h1;
      end
  else if(pciephy_ctrl_31_we)
  begin
  reg_pciephy_ctrl_31 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_32 <= 32'h0;
      end
  else if(pciephy_ctrl_32_we)
  begin
  reg_pciephy_ctrl_32 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_33 <= 32'h1;
      end
  else if(pciephy_ctrl_33_we)
  begin
  reg_pciephy_ctrl_33 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_34 <= 32'h0;
      end
  else if(pciephy_ctrl_34_we)
  begin
  reg_pciephy_ctrl_34 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_35 <= 32'h1;
      end
  else if(pciephy_ctrl_35_we)
  begin
  reg_pciephy_ctrl_35 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_36 <= 32'h0;
      end
  else if(pciephy_ctrl_36_we)
  begin
  reg_pciephy_ctrl_36 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_37 <= 32'h1;
      end
  else if(pciephy_ctrl_37_we)
  begin
  reg_pciephy_ctrl_37 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_38 <= 32'h0;
      end
  else if(pciephy_ctrl_38_we)
  begin
  reg_pciephy_ctrl_38 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_39 <= 32'h1;
      end
  else if(pciephy_ctrl_39_we)
  begin
  reg_pciephy_ctrl_39 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_40 <= 32'h0;
      end
  else if(pciephy_ctrl_40_we)
  begin
  reg_pciephy_ctrl_40 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_41 <= 32'h1;
      end
  else if(pciephy_ctrl_41_we)
  begin
  reg_pciephy_ctrl_41 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_42 <= 32'h0;
      end
  else if(pciephy_ctrl_42_we)
  begin
  reg_pciephy_ctrl_42 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_43 <= 32'h1;
      end
  else if(pciephy_ctrl_43_we)
  begin
  reg_pciephy_ctrl_43 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_44 <= 32'h0;
      end
  else if(pciephy_ctrl_44_we)
  begin
  reg_pciephy_ctrl_44 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_45 <= 32'h1;
      end
  else if(pciephy_ctrl_45_we)
  begin
  reg_pciephy_ctrl_45 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_46 <= 32'h0;
      end
  else if(pciephy_ctrl_46_we)
  begin
  reg_pciephy_ctrl_46 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_47 <= 32'h1;
      end
  else if(pciephy_ctrl_47_we)
  begin
  reg_pciephy_ctrl_47 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_48 <= 32'h0;
      end
  else if(pciephy_ctrl_48_we)
  begin
  reg_pciephy_ctrl_48 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_49 <= 32'h1;
      end
  else if(pciephy_ctrl_49_we)
  begin
  reg_pciephy_ctrl_49 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_50 <= 32'h0;
      end
  else if(pciephy_ctrl_50_we)
  begin
  reg_pciephy_ctrl_50 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_51 <= 32'h0;
      end
  else if(pciephy_ctrl_51_we)
  begin
  reg_pciephy_ctrl_51 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_52 <= 32'h0;
      end
  else if(pciephy_ctrl_52_we)
  begin
  reg_pciephy_ctrl_52 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_53 <= 32'h0;
      end
  else if(pciephy_ctrl_53_we)
  begin
  reg_pciephy_ctrl_53 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_54 <= 32'h0;
      end
  else if(pciephy_ctrl_54_we)
  begin
  reg_pciephy_ctrl_54 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_55 <= 32'h0;
      end
  else if(pciephy_ctrl_55_we)
  begin
  reg_pciephy_ctrl_55 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_56 <= 32'h0;
      end
  else if(pciephy_ctrl_56_we)
  begin
  reg_pciephy_ctrl_56 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_57 <= 32'h0;
      end
  else if(pciephy_ctrl_57_we)
  begin
  reg_pciephy_ctrl_57 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_58 <= 32'h0;
      end
  else if(pciephy_ctrl_58_we)
  begin
  reg_pciephy_ctrl_58 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_59 <= 32'h0;
      end
  else if(pciephy_ctrl_59_we)
  begin
  reg_pciephy_ctrl_59 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_60 <= 32'h0;
      end
  else if(pciephy_ctrl_60_we)
  begin
  reg_pciephy_ctrl_60 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_61 <= 32'h0;
      end
  else if(pciephy_ctrl_61_we)
  begin
  reg_pciephy_ctrl_61 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_62 <= 32'h0;
      end
  else if(pciephy_ctrl_62_we)
  begin
  reg_pciephy_ctrl_62 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_63 <= 32'h0;
      end
  else if(pciephy_ctrl_63_we)
  begin
  reg_pciephy_ctrl_63 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_64 <= 32'h0;
      end
  else if(pciephy_ctrl_64_we)
  begin
  reg_pciephy_ctrl_64 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_65 <= 32'h0;
      end
  else if(pciephy_ctrl_65_we)
  begin
  reg_pciephy_ctrl_65 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_66 <= 32'h0;
      end
  else if(pciephy_ctrl_66_we)
  begin
  reg_pciephy_ctrl_66 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_67 <= 32'h0;
      end
  else if(pciephy_ctrl_67_we)
  begin
  reg_pciephy_ctrl_67 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_68 <= 32'h0;
      end
  else if(pciephy_ctrl_68_we)
  begin
  reg_pciephy_ctrl_68 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_69 <= 32'h0;
      end
  else if(pciephy_ctrl_69_we)
  begin
  reg_pciephy_ctrl_69 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_70 <= 32'h0;
      end
  else if(pciephy_ctrl_70_we)
  begin
  reg_pciephy_ctrl_70 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_71 <= 32'h0;
      end
  else if(pciephy_ctrl_71_we)
  begin
  reg_pciephy_ctrl_71 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_72 <= 32'h0;
      end
  else if(pciephy_ctrl_72_we)
  begin
  reg_pciephy_ctrl_72 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_73 <= 32'h0;
      end
  else if(pciephy_ctrl_73_we)
  begin
  reg_pciephy_ctrl_73 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_74 <= 32'h0;
      end
  else if(pciephy_ctrl_74_we)
  begin
  reg_pciephy_ctrl_74 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_75 <= 32'h0;
      end
  else if(pciephy_ctrl_75_we)
  begin
  reg_pciephy_ctrl_75 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_76 <= 32'h0;
      end
  else if(pciephy_ctrl_76_we)
  begin
  reg_pciephy_ctrl_76 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_77 <= 32'h0;
      end
  else if(pciephy_ctrl_77_we)
  begin
  reg_pciephy_ctrl_77 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_78 <= 32'h0;
      end
  else if(pciephy_ctrl_78_we)
  begin
  reg_pciephy_ctrl_78 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_79 <= 32'h0;
      end
  else if(pciephy_ctrl_79_we)
  begin
  reg_pciephy_ctrl_79 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_80 <= 32'h0;
      end
  else if(pciephy_ctrl_80_we)
  begin
  reg_pciephy_ctrl_80 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_81 <= 32'h0;
      end
  else if(pciephy_ctrl_81_we)
  begin
  reg_pciephy_ctrl_81 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_82 <= 32'h0;
      end
  else if(pciephy_ctrl_82_we)
  begin
  reg_pciephy_ctrl_82 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_83 <= 32'h0;
      end
  else if(pciephy_ctrl_83_we)
  begin
  reg_pciephy_ctrl_83 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_84 <= 32'h0;
      end
  else if(pciephy_ctrl_84_we)
  begin
  reg_pciephy_ctrl_84 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_85 <= 32'h0;
      end
  else if(pciephy_ctrl_85_we)
  begin
  reg_pciephy_ctrl_85 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_86 <= 32'h0;
      end
  else if(pciephy_ctrl_86_we)
  begin
  reg_pciephy_ctrl_86 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_87 <= 32'h0;
      end
  else if(pciephy_ctrl_87_we)
  begin
  reg_pciephy_ctrl_87 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_88 <= 32'h0;
      end
  else if(pciephy_ctrl_88_we)
  begin
  reg_pciephy_ctrl_88 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_89 <= 32'h0;
      end
  else if(pciephy_ctrl_89_we)
  begin
  reg_pciephy_ctrl_89 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_90 <= 32'h0;
      end
  else if(pciephy_ctrl_90_we)
  begin
  reg_pciephy_ctrl_90 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_91 <= 32'h1;
      end
  else if(pciephy_ctrl_91_we)
  begin
  reg_pciephy_ctrl_91 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_92 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_92_we)
  begin
  reg_pciephy_ctrl_92 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_93 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_93_we)
  begin
  reg_pciephy_ctrl_93 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_94 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_94_we)
  begin
  reg_pciephy_ctrl_94 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_95 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_95_we)
  begin
  reg_pciephy_ctrl_95 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_96 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_96_we)
  begin
  reg_pciephy_ctrl_96 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_97 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_97_we)
  begin
  reg_pciephy_ctrl_97 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_98 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_98_we)
  begin
  reg_pciephy_ctrl_98 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_99 <= 32'h3E03E;
      end
  else if(pciephy_ctrl_99_we)
  begin
  reg_pciephy_ctrl_99 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_100 <= 32'h0;
      end
  else if(pciephy_ctrl_100_we)
  begin
  reg_pciephy_ctrl_100 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_101 <= 32'h0;
      end
  else if(pciephy_ctrl_101_we)
  begin
  reg_pciephy_ctrl_101 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_102 <= 32'h0;
      end
  else if(pciephy_ctrl_102_we)
  begin
  reg_pciephy_ctrl_102 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_103 <= 32'h0;
      end
  else if(pciephy_ctrl_103_we)
  begin
  reg_pciephy_ctrl_103 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_104 <= 32'h0;
      end
  else if(pciephy_ctrl_104_we)
  begin
  reg_pciephy_ctrl_104 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_105 <= 32'h21400;
      end
  else if(pciephy_ctrl_105_we)
  begin
  reg_pciephy_ctrl_105 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_106 <= 32'h0;
      end
  else if(pciephy_ctrl_106_we)
  begin
  reg_pciephy_ctrl_106 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_107 <= 32'h0;
      end
  else if(pciephy_ctrl_107_we)
  begin
  reg_pciephy_ctrl_107 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_108 <= 32'h0;
      end
  else if(pciephy_ctrl_108_we)
  begin
  reg_pciephy_ctrl_108 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_109 <= 32'h0;
      end
  else if(pciephy_ctrl_109_we)
  begin
  reg_pciephy_ctrl_109 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_110 <= 32'h0;
      end
  else if(pciephy_ctrl_110_we)
  begin
  reg_pciephy_ctrl_110 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_111 <= 32'h0;
      end
  else if(pciephy_ctrl_111_we)
  begin
  reg_pciephy_ctrl_111 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_112 <= 32'h0;
      end
  else if(pciephy_ctrl_112_we)
  begin
  reg_pciephy_ctrl_112 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_113 <= 32'h0;
      end
  else if(pciephy_ctrl_113_we)
  begin
  reg_pciephy_ctrl_113 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_114 <= 32'h0;
      end
  else if(pciephy_ctrl_114_we)
  begin
  reg_pciephy_ctrl_114 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_115 <= 32'h0;
      end
  else if(pciephy_ctrl_115_we)
  begin
  reg_pciephy_ctrl_115 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_116 <= 32'h0;
      end
  else if(pciephy_ctrl_116_we)
  begin
  reg_pciephy_ctrl_116 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_117 <= 32'h0;
      end
  else if(pciephy_ctrl_117_we)
  begin
  reg_pciephy_ctrl_117 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_118 <= 32'h0;
      end
  else if(pciephy_ctrl_118_we)
  begin
  reg_pciephy_ctrl_118 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_119 <= 32'h0;
      end
  else if(pciephy_ctrl_119_we)
  begin
  reg_pciephy_ctrl_119 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_120 <= 32'h0;
      end
  else if(pciephy_ctrl_120_we)
  begin
  reg_pciephy_ctrl_120 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_121 <= 32'h0;
      end
  else if(pciephy_ctrl_121_we)
  begin
  reg_pciephy_ctrl_121 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_122 <= 32'h0;
      end
  else if(pciephy_ctrl_122_we)
  begin
  reg_pciephy_ctrl_122 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_123 <= 32'h0;
      end
  else if(pciephy_ctrl_123_we)
  begin
  reg_pciephy_ctrl_123 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_124 <= 32'h0;
      end
  else if(pciephy_ctrl_124_we)
  begin
  reg_pciephy_ctrl_124 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_125 <= 32'h0;
      end
  else if(pciephy_ctrl_125_we)
  begin
  reg_pciephy_ctrl_125 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_126 <= 32'h0;
      end
  else if(pciephy_ctrl_126_we)
  begin
  reg_pciephy_ctrl_126 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_127 <= 32'h0;
      end
  else if(pciephy_ctrl_127_we)
  begin
  reg_pciephy_ctrl_127 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_128 <= 32'h0;
      end
  else if(pciephy_ctrl_128_we)
  begin
  reg_pciephy_ctrl_128 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_129 <= 32'h0;
      end
  else if(pciephy_ctrl_129_we)
  begin
  reg_pciephy_ctrl_129 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_130 <= 32'h0;
      end
  else if(pciephy_ctrl_130_we)
  begin
  reg_pciephy_ctrl_130 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_131 <= 32'h0;
      end
  else if(pciephy_ctrl_131_we)
  begin
  reg_pciephy_ctrl_131 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_132 <= 32'h0;
      end
  else if(pciephy_ctrl_132_we)
  begin
  reg_pciephy_ctrl_132 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_133 <= 32'h0;
      end
  else if(pciephy_ctrl_133_we)
  begin
  reg_pciephy_ctrl_133 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_134 <= 32'h0;
      end
  else if(pciephy_ctrl_134_we)
  begin
  reg_pciephy_ctrl_134 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_135 <= 32'h0;
      end
  else if(pciephy_ctrl_135_we)
  begin
  reg_pciephy_ctrl_135 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_136 <= 32'h0;
      end
  else if(pciephy_ctrl_136_we)
  begin
  reg_pciephy_ctrl_136 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_137 <= 32'h0;
      end
  else if(pciephy_ctrl_137_we)
  begin
  reg_pciephy_ctrl_137 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_138 <= 32'h0;
      end
  else if(pciephy_ctrl_138_we)
  begin
  reg_pciephy_ctrl_138 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_139 <= 32'h0;
      end
  else if(pciephy_ctrl_139_we)
  begin
  reg_pciephy_ctrl_139 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_140 <= 32'h0;
      end
  else if(pciephy_ctrl_140_we)
  begin
  reg_pciephy_ctrl_140 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_141 <= 32'h0;
      end
  else if(pciephy_ctrl_141_we)
  begin
  reg_pciephy_ctrl_141 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_142 <= 32'h0;
      end
  else if(pciephy_ctrl_142_we)
  begin
  reg_pciephy_ctrl_142 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_143 <= 32'h0;
      end
  else if(pciephy_ctrl_143_we)
  begin
  reg_pciephy_ctrl_143 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_144 <= 32'h0;
      end
  else if(pciephy_ctrl_144_we)
  begin
  reg_pciephy_ctrl_144 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_145 <= 32'h0;
      end
  else if(pciephy_ctrl_145_we)
  begin
  reg_pciephy_ctrl_145 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_146 <= 32'h0;
      end
  else if(pciephy_ctrl_146_we)
  begin
  reg_pciephy_ctrl_146 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_147 <= 32'h0;
      end
  else if(pciephy_ctrl_147_we)
  begin
  reg_pciephy_ctrl_147 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_148 <= 32'h0;
      end
  else if(pciephy_ctrl_148_we)
  begin
  reg_pciephy_ctrl_148 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_149 <= 32'h0;
      end
  else if(pciephy_ctrl_149_we)
  begin
  reg_pciephy_ctrl_149 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_150 <= 32'h0;
      end
  else if(pciephy_ctrl_150_we)
  begin
  reg_pciephy_ctrl_150 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_151 <= 32'h0;
      end
  else if(pciephy_ctrl_151_we)
  begin
  reg_pciephy_ctrl_151 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_152 <= 32'h0;
      end
  else if(pciephy_ctrl_152_we)
  begin
  reg_pciephy_ctrl_152 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_153 <= 32'h0;
      end
  else if(pciephy_ctrl_153_we)
  begin
  reg_pciephy_ctrl_153 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_154 <= 32'h0;
      end
  else if(pciephy_ctrl_154_we)
  begin
  reg_pciephy_ctrl_154 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_155 <= 32'h0;
      end
  else if(pciephy_ctrl_155_we)
  begin
  reg_pciephy_ctrl_155 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_156 <= 32'h0;
      end
  else if(pciephy_ctrl_156_we)
  begin
  reg_pciephy_ctrl_156 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_157 <= 32'h0;
      end
  else if(pciephy_ctrl_157_we)
  begin
  reg_pciephy_ctrl_157 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_158 <= 32'h0;
      end
  else if(pciephy_ctrl_158_we)
  begin
  reg_pciephy_ctrl_158 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_159 <= 32'h0;
      end
  else if(pciephy_ctrl_159_we)
  begin
  reg_pciephy_ctrl_159 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_160 <= 32'h0;
      end
  else if(pciephy_ctrl_160_we)
  begin
  reg_pciephy_ctrl_160 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_161 <= 32'h0;
      end
  else if(pciephy_ctrl_161_we)
  begin
  reg_pciephy_ctrl_161 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_162 <= 32'h0;
      end
  else if(pciephy_ctrl_162_we)
  begin
  reg_pciephy_ctrl_162 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_163 <= 32'h0;
      end
  else if(pciephy_ctrl_163_we)
  begin
  reg_pciephy_ctrl_163 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_164 <= 32'h0;
      end
  else if(pciephy_ctrl_164_we)
  begin
  reg_pciephy_ctrl_164 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_165 <= 32'h0;
      end
  else if(pciephy_ctrl_165_we)
  begin
  reg_pciephy_ctrl_165 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_166 <= 32'h0;
      end
  else if(pciephy_ctrl_166_we)
  begin
  reg_pciephy_ctrl_166 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_167 <= 32'h0;
      end
  else if(pciephy_ctrl_167_we)
  begin
  reg_pciephy_ctrl_167 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_168 <= 32'h0;
      end
  else if(pciephy_ctrl_168_we)
  begin
  reg_pciephy_ctrl_168 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_169 <= 32'h0;
      end
  else if(pciephy_ctrl_169_we)
  begin
  reg_pciephy_ctrl_169 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_170 <= 32'h0;
      end
  else if(pciephy_ctrl_170_we)
  begin
  reg_pciephy_ctrl_170 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_171 <= 32'h0;
      end
  else if(pciephy_ctrl_171_we)
  begin
  reg_pciephy_ctrl_171 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_172 <= 32'h0;
      end
  else if(pciephy_ctrl_172_we)
  begin
  reg_pciephy_ctrl_172 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_173 <= 32'h0;
      end
  else if(pciephy_ctrl_173_we)
  begin
  reg_pciephy_ctrl_173 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_174 <= 32'h0;
      end
  else if(pciephy_ctrl_174_we)
  begin
  reg_pciephy_ctrl_174 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_175 <= 32'h0;
      end
  else if(pciephy_ctrl_175_we)
  begin
  reg_pciephy_ctrl_175 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_176 <= 32'h0;
      end
  else if(pciephy_ctrl_176_we)
  begin
  reg_pciephy_ctrl_176 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_177 <= 32'h0;
      end
  else if(pciephy_ctrl_177_we)
  begin
  reg_pciephy_ctrl_177 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_178 <= 32'h0;
      end
  else if(pciephy_ctrl_178_we)
  begin
  reg_pciephy_ctrl_178 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_179 <= 32'h0;
      end
  else if(pciephy_ctrl_179_we)
  begin
  reg_pciephy_ctrl_179 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_180 <= 32'h0;
      end
  else if(pciephy_ctrl_180_we)
  begin
  reg_pciephy_ctrl_180 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_181 <= 32'h0;
      end
  else if(pciephy_ctrl_181_we)
  begin
  reg_pciephy_ctrl_181 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_182 <= 32'h0;
      end
  else if(pciephy_ctrl_182_we)
  begin
  reg_pciephy_ctrl_182 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_183 <= 32'h0;
      end
  else if(pciephy_ctrl_183_we)
  begin
  reg_pciephy_ctrl_183 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_184 <= 32'h0;
      end
  else if(pciephy_ctrl_184_we)
  begin
  reg_pciephy_ctrl_184 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_185 <= 32'h0;
      end
  else if(pciephy_ctrl_185_we)
  begin
  reg_pciephy_ctrl_185 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_186 <= 32'h0;
      end
  else if(pciephy_ctrl_186_we)
  begin
  reg_pciephy_ctrl_186 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_187 <= 32'h0;
      end
  else if(pciephy_ctrl_187_we)
  begin
  reg_pciephy_ctrl_187 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_188 <= 32'h0;
      end
  else if(pciephy_ctrl_188_we)
  begin
  reg_pciephy_ctrl_188 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_189 <= 32'h0;
      end
  else if(pciephy_ctrl_189_we)
  begin
  reg_pciephy_ctrl_189 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_190 <= 32'h0;
      end
  else if(pciephy_ctrl_190_we)
  begin
  reg_pciephy_ctrl_190 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_191 <= 32'h0;
      end
  else if(pciephy_ctrl_191_we)
  begin
  reg_pciephy_ctrl_191 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_192 <= 32'h0;
      end
  else if(pciephy_ctrl_192_we)
  begin
  reg_pciephy_ctrl_192 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_193 <= 32'h0;
      end
  else if(pciephy_ctrl_193_we)
  begin
  reg_pciephy_ctrl_193 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_194 <= 32'h0;
      end
  else if(pciephy_ctrl_194_we)
  begin
  reg_pciephy_ctrl_194 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_195 <= 32'h0;
      end
  else if(pciephy_ctrl_195_we)
  begin
  reg_pciephy_ctrl_195 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_196 <= 32'h0;
      end
  else if(pciephy_ctrl_196_we)
  begin
  reg_pciephy_ctrl_196 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_197 <= 32'h0;
      end
  else if(pciephy_ctrl_197_we)
  begin
  reg_pciephy_ctrl_197 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_198 <= 32'h0;
      end
  else if(pciephy_ctrl_198_we)
  begin
  reg_pciephy_ctrl_198 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_199 <= 32'h0;
      end
  else if(pciephy_ctrl_199_we)
  begin
  reg_pciephy_ctrl_199 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_200 <= 32'h0;
      end
  else if(pciephy_ctrl_200_we)
  begin
  reg_pciephy_ctrl_200 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_201 <= 32'h0;
      end
  else if(pciephy_ctrl_201_we)
  begin
  reg_pciephy_ctrl_201 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_202 <= 32'h0;
      end
  else if(pciephy_ctrl_202_we)
  begin
  reg_pciephy_ctrl_202 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_203 <= 32'h0;
      end
  else if(pciephy_ctrl_203_we)
  begin
  reg_pciephy_ctrl_203 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_204 <= 32'h0;
      end
  else if(pciephy_ctrl_204_we)
  begin
  reg_pciephy_ctrl_204 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_205 <= 32'h0;
      end
  else if(pciephy_ctrl_205_we)
  begin
  reg_pciephy_ctrl_205 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_206 <= 32'h0;
      end
  else if(pciephy_ctrl_206_we)
  begin
  reg_pciephy_ctrl_206 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_207 <= 32'h0;
      end
  else if(pciephy_ctrl_207_we)
  begin
  reg_pciephy_ctrl_207 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_208 <= 32'h0;
      end
  else if(pciephy_ctrl_208_we)
  begin
  reg_pciephy_ctrl_208 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_209 <= 32'h0;
      end
  else if(pciephy_ctrl_209_we)
  begin
  reg_pciephy_ctrl_209 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_210 <= 32'h0;
      end
  else if(pciephy_ctrl_210_we)
  begin
  reg_pciephy_ctrl_210 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_211 <= 32'h0;
      end
  else if(pciephy_ctrl_211_we)
  begin
  reg_pciephy_ctrl_211 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_212 <= 32'h0;
      end
  else if(pciephy_ctrl_212_we)
  begin
  reg_pciephy_ctrl_212 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_213 <= 32'h0;
      end
  else if(pciephy_ctrl_213_we)
  begin
  reg_pciephy_ctrl_213 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_214 <= 32'h0;
      end
  else if(pciephy_ctrl_214_we)
  begin
  reg_pciephy_ctrl_214 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_215 <= 32'h0;
      end
  else if(pciephy_ctrl_215_we)
  begin
  reg_pciephy_ctrl_215 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_216 <= 32'h0;
      end
  else if(pciephy_ctrl_216_we)
  begin
  reg_pciephy_ctrl_216 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_217 <= 32'h0;
      end
  else if(pciephy_ctrl_217_we)
  begin
  reg_pciephy_ctrl_217 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_218 <= 32'h0;
      end
  else if(pciephy_ctrl_218_we)
  begin
  reg_pciephy_ctrl_218 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_219 <= 32'h0;
      end
  else if(pciephy_ctrl_219_we)
  begin
  reg_pciephy_ctrl_219 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_220 <= 32'h0;
      end
  else if(pciephy_ctrl_220_we)
  begin
  reg_pciephy_ctrl_220 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_221 <= 32'h0;
      end
  else if(pciephy_ctrl_221_we)
  begin
  reg_pciephy_ctrl_221 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_222 <= 32'h0;
      end
  else if(pciephy_ctrl_222_we)
  begin
  reg_pciephy_ctrl_222 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_223 <= 32'h0;
      end
  else if(pciephy_ctrl_223_we)
  begin
  reg_pciephy_ctrl_223 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_224 <= 32'h0;
      end
  else if(pciephy_ctrl_224_we)
  begin
  reg_pciephy_ctrl_224 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_225 <= 32'h0;
      end
  else if(pciephy_ctrl_225_we)
  begin
  reg_pciephy_ctrl_225 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_226 <= 32'h0;
      end
  else if(pciephy_ctrl_226_we)
  begin
  reg_pciephy_ctrl_226 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_227 <= 32'h0;
      end
  else if(pciephy_ctrl_227_we)
  begin
  reg_pciephy_ctrl_227 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_228 <= 32'h0;
      end
  else if(pciephy_ctrl_228_we)
  begin
  reg_pciephy_ctrl_228 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_229 <= 32'h0;
      end
  else if(pciephy_ctrl_229_we)
  begin
  reg_pciephy_ctrl_229 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_230 <= 32'h0;
      end
  else if(pciephy_ctrl_230_we)
  begin
  reg_pciephy_ctrl_230 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_231 <= 32'h0;
      end
  else if(pciephy_ctrl_231_we)
  begin
  reg_pciephy_ctrl_231 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_232 <= 32'h0;
      end
  else if(pciephy_ctrl_232_we)
  begin
  reg_pciephy_ctrl_232 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_233 <= 32'h0;
      end
  else if(pciephy_ctrl_233_we)
  begin
  reg_pciephy_ctrl_233 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_234 <= 32'h0;
      end
  else if(pciephy_ctrl_234_we)
  begin
  reg_pciephy_ctrl_234 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_235 <= 32'h0;
      end
  else if(pciephy_ctrl_235_we)
  begin
  reg_pciephy_ctrl_235 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_236 <= 32'h0;
      end
  else if(pciephy_ctrl_236_we)
  begin
  reg_pciephy_ctrl_236 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_237 <= 32'h0;
      end
  else if(pciephy_ctrl_237_we)
  begin
  reg_pciephy_ctrl_237 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_238 <= 32'h0;
      end
  else if(pciephy_ctrl_238_we)
  begin
  reg_pciephy_ctrl_238 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_239 <= 32'h0;
      end
  else if(pciephy_ctrl_239_we)
  begin
  reg_pciephy_ctrl_239 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_240 <= 32'h0;
      end
  else if(pciephy_ctrl_240_we)
  begin
  reg_pciephy_ctrl_240 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_241 <= 32'h0;
      end
  else if(pciephy_ctrl_241_we)
  begin
  reg_pciephy_ctrl_241 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_242 <= 32'h0;
      end
  else if(pciephy_ctrl_242_we)
  begin
  reg_pciephy_ctrl_242 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_243 <= 32'h0;
      end
  else if(pciephy_ctrl_243_we)
  begin
  reg_pciephy_ctrl_243 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_244 <= 32'h0;
      end
  else if(pciephy_ctrl_244_we)
  begin
  reg_pciephy_ctrl_244 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_245 <= 32'h0;
      end
  else if(pciephy_ctrl_245_we)
  begin
  reg_pciephy_ctrl_245 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_246 <= 32'h0;
      end
  else if(pciephy_ctrl_246_we)
  begin
  reg_pciephy_ctrl_246 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_247 <= 32'h0;
      end
  else if(pciephy_ctrl_247_we)
  begin
  reg_pciephy_ctrl_247 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_248 <= 32'h0;
      end
  else if(pciephy_ctrl_248_we)
  begin
  reg_pciephy_ctrl_248 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_249 <= 32'h0;
      end
  else if(pciephy_ctrl_249_we)
  begin
  reg_pciephy_ctrl_249 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_250 <= 32'h0;
      end
  else if(pciephy_ctrl_250_we)
  begin
  reg_pciephy_ctrl_250 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_251 <= 32'h0;
      end
  else if(pciephy_ctrl_251_we)
  begin
  reg_pciephy_ctrl_251 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_252 <= 32'h0;
      end
  else if(pciephy_ctrl_252_we)
  begin
  reg_pciephy_ctrl_252 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_253 <= 32'h0;
      end
  else if(pciephy_ctrl_253_we)
  begin
  reg_pciephy_ctrl_253 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_254 <= 32'h0;
      end
  else if(pciephy_ctrl_254_we)
  begin
  reg_pciephy_ctrl_254 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_255 <= 32'h0;
      end
  else if(pciephy_ctrl_255_we)
  begin
  reg_pciephy_ctrl_255 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_256 <= 32'h0;
      end
  else if(pciephy_ctrl_256_we)
  begin
  reg_pciephy_ctrl_256 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_257 <= 32'h0;
      end
  else if(pciephy_ctrl_257_we)
  begin
  reg_pciephy_ctrl_257 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_258 <= 32'h0;
      end
  else if(pciephy_ctrl_258_we)
  begin
  reg_pciephy_ctrl_258 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_259 <= 32'h0;
      end
  else if(pciephy_ctrl_259_we)
  begin
  reg_pciephy_ctrl_259 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_260 <= 32'h0;
      end
  else if(pciephy_ctrl_260_we)
  begin
  reg_pciephy_ctrl_260 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_261 <= 32'h0;
      end
  else if(pciephy_ctrl_261_we)
  begin
  reg_pciephy_ctrl_261 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_262 <= 32'h0;
      end
  else if(pciephy_ctrl_262_we)
  begin
  reg_pciephy_ctrl_262 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_263 <= 32'h0;
      end
  else if(pciephy_ctrl_263_we)
  begin
  reg_pciephy_ctrl_263 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_264 <= 32'h0;
      end
  else if(pciephy_ctrl_264_we)
  begin
  reg_pciephy_ctrl_264 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_265 <= 32'h0;
      end
  else if(pciephy_ctrl_265_we)
  begin
  reg_pciephy_ctrl_265 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_266 <= 32'h0;
      end
  else if(pciephy_ctrl_266_we)
  begin
  reg_pciephy_ctrl_266 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_267 <= 32'h0;
      end
  else if(pciephy_ctrl_267_we)
  begin
  reg_pciephy_ctrl_267 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_268 <= 32'h0;
      end
  else if(pciephy_ctrl_268_we)
  begin
  reg_pciephy_ctrl_268 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_269 <= 32'h0;
      end
  else if(pciephy_ctrl_269_we)
  begin
  reg_pciephy_ctrl_269 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_270 <= 32'h0;
      end
  else if(pciephy_ctrl_270_we)
  begin
  reg_pciephy_ctrl_270 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_271 <= 32'h0;
      end
  else if(pciephy_ctrl_271_we)
  begin
  reg_pciephy_ctrl_271 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_272 <= 32'h0;
      end
  else if(pciephy_ctrl_272_we)
  begin
  reg_pciephy_ctrl_272 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_273 <= 32'h0;
      end
  else if(pciephy_ctrl_273_we)
  begin
  reg_pciephy_ctrl_273 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_274 <= 32'h0;
      end
  else if(pciephy_ctrl_274_we)
  begin
  reg_pciephy_ctrl_274 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_275 <= 32'h0;
      end
  else if(pciephy_ctrl_275_we)
  begin
  reg_pciephy_ctrl_275 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_276 <= 32'h0;
      end
  else if(pciephy_ctrl_276_we)
  begin
  reg_pciephy_ctrl_276 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_277 <= 32'h0;
      end
  else if(pciephy_ctrl_277_we)
  begin
  reg_pciephy_ctrl_277 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_278 <= 32'h0;
      end
  else if(pciephy_ctrl_278_we)
  begin
  reg_pciephy_ctrl_278 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_279 <= 32'h0;
      end
  else if(pciephy_ctrl_279_we)
  begin
  reg_pciephy_ctrl_279 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_280 <= 32'h0;
      end
  else if(pciephy_ctrl_280_we)
  begin
  reg_pciephy_ctrl_280 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_281 <= 32'h0;
      end
  else if(pciephy_ctrl_281_we)
  begin
  reg_pciephy_ctrl_281 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_282 <= 32'h0;
      end
  else if(pciephy_ctrl_282_we)
  begin
  reg_pciephy_ctrl_282 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_283 <= 32'h0;
      end
  else if(pciephy_ctrl_283_we)
  begin
  reg_pciephy_ctrl_283 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_284 <= 32'h0;
      end
  else if(pciephy_ctrl_284_we)
  begin
  reg_pciephy_ctrl_284 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_285 <= 32'h0;
      end
  else if(pciephy_ctrl_285_we)
  begin
  reg_pciephy_ctrl_285 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_286 <= 32'h0;
      end
  else if(pciephy_ctrl_286_we)
  begin
  reg_pciephy_ctrl_286 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_287 <= 32'h0;
      end
  else if(pciephy_ctrl_287_we)
  begin
  reg_pciephy_ctrl_287 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_288 <= 32'h0;
      end
  else if(pciephy_ctrl_288_we)
  begin
  reg_pciephy_ctrl_288 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_289 <= 32'h0;
      end
  else if(pciephy_ctrl_289_we)
  begin
  reg_pciephy_ctrl_289 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_290 <= 32'h0;
      end
  else if(pciephy_ctrl_290_we)
  begin
  reg_pciephy_ctrl_290 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_291 <= 32'h0;
      end
  else if(pciephy_ctrl_291_we)
  begin
  reg_pciephy_ctrl_291 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_292 <= 32'h0;
      end
  else if(pciephy_ctrl_292_we)
  begin
  reg_pciephy_ctrl_292 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_293 <= 32'h0;
      end
  else if(pciephy_ctrl_293_we)
  begin
  reg_pciephy_ctrl_293 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_294 <= 32'h0;
      end
  else if(pciephy_ctrl_294_we)
  begin
  reg_pciephy_ctrl_294 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_295 <= 32'h0;
      end
  else if(pciephy_ctrl_295_we)
  begin
  reg_pciephy_ctrl_295 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_296 <= 32'h0;
      end
  else if(pciephy_ctrl_296_we)
  begin
  reg_pciephy_ctrl_296 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_297 <= 32'h0;
      end
  else if(pciephy_ctrl_297_we)
  begin
  reg_pciephy_ctrl_297 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_298 <= 32'h0;
      end
  else if(pciephy_ctrl_298_we)
  begin
  reg_pciephy_ctrl_298 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_299 <= 32'h0;
      end
  else if(pciephy_ctrl_299_we)
  begin
  reg_pciephy_ctrl_299 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_300 <= 32'h0;
      end
  else if(pciephy_ctrl_300_we)
  begin
  reg_pciephy_ctrl_300 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_301 <= 32'h0;
      end
  else if(pciephy_ctrl_301_we)
  begin
  reg_pciephy_ctrl_301 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_302 <= 32'h0;
      end
  else if(pciephy_ctrl_302_we)
  begin
  reg_pciephy_ctrl_302 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_303 <= 32'h0;
      end
  else if(pciephy_ctrl_303_we)
  begin
  reg_pciephy_ctrl_303 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_304 <= 32'h0;
      end
  else if(pciephy_ctrl_304_we)
  begin
  reg_pciephy_ctrl_304 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_305 <= 32'h0;
      end
  else if(pciephy_ctrl_305_we)
  begin
  reg_pciephy_ctrl_305 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_306 <= 32'h0;
      end
  else if(pciephy_ctrl_306_we)
  begin
  reg_pciephy_ctrl_306 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_307 <= 32'h0;
      end
  else if(pciephy_ctrl_307_we)
  begin
  reg_pciephy_ctrl_307 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_308 <= 32'h0;
      end
  else if(pciephy_ctrl_308_we)
  begin
  reg_pciephy_ctrl_308 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_309 <= 32'h0;
      end
  else if(pciephy_ctrl_309_we)
  begin
  reg_pciephy_ctrl_309 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_310 <= 32'h0;
      end
  else if(pciephy_ctrl_310_we)
  begin
  reg_pciephy_ctrl_310 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_311 <= 32'h0;
      end
  else if(pciephy_ctrl_311_we)
  begin
  reg_pciephy_ctrl_311 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_312 <= 32'h0;
      end
  else if(pciephy_ctrl_312_we)
  begin
  reg_pciephy_ctrl_312 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_313 <= 32'h0;
      end
  else if(pciephy_ctrl_313_we)
  begin
  reg_pciephy_ctrl_313 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_314 <= 32'h0;
      end
  else if(pciephy_ctrl_314_we)
  begin
  reg_pciephy_ctrl_314 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_315 <= 32'h0;
      end
  else if(pciephy_ctrl_315_we)
  begin
  reg_pciephy_ctrl_315 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_316 <= 32'h0;
      end
  else if(pciephy_ctrl_316_we)
  begin
  reg_pciephy_ctrl_316 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_317 <= 32'h0;
      end
  else if(pciephy_ctrl_317_we)
  begin
  reg_pciephy_ctrl_317 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_318 <= 32'h0;
      end
  else if(pciephy_ctrl_318_we)
  begin
  reg_pciephy_ctrl_318 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_319 <= 32'h0;
      end
  else if(pciephy_ctrl_319_we)
  begin
  reg_pciephy_ctrl_319 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_320 <= 32'h0;
      end
  else if(pciephy_ctrl_320_we)
  begin
  reg_pciephy_ctrl_320 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_321 <= 32'h0;
      end
  else if(pciephy_ctrl_321_we)
  begin
  reg_pciephy_ctrl_321 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_322 <= 32'h0;
      end
  else if(pciephy_ctrl_322_we)
  begin
  reg_pciephy_ctrl_322 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_323 <= 32'h0;
      end
  else if(pciephy_ctrl_323_we)
  begin
  reg_pciephy_ctrl_323 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_324 <= 32'h0;
      end
  else if(pciephy_ctrl_324_we)
  begin
  reg_pciephy_ctrl_324 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_325 <= 32'h0;
      end
  else if(pciephy_ctrl_325_we)
  begin
  reg_pciephy_ctrl_325 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_326 <= 32'h0;
      end
  else if(pciephy_ctrl_326_we)
  begin
  reg_pciephy_ctrl_326 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_327 <= 32'h0;
      end
  else if(pciephy_ctrl_327_we)
  begin
  reg_pciephy_ctrl_327 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_328 <= 32'h0;
      end
  else if(pciephy_ctrl_328_we)
  begin
  reg_pciephy_ctrl_328 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_329 <= 32'h0;
      end
  else if(pciephy_ctrl_329_we)
  begin
  reg_pciephy_ctrl_329 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_330 <= 32'h0;
      end
  else if(pciephy_ctrl_330_we)
  begin
  reg_pciephy_ctrl_330 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_331 <= 32'h0;
      end
  else if(pciephy_ctrl_331_we)
  begin
  reg_pciephy_ctrl_331 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_332 <= 32'h0;
      end
  else if(pciephy_ctrl_332_we)
  begin
  reg_pciephy_ctrl_332 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_333 <= 32'h0;
      end
  else if(pciephy_ctrl_333_we)
  begin
  reg_pciephy_ctrl_333 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_334 <= 32'h0;
      end
  else if(pciephy_ctrl_334_we)
  begin
  reg_pciephy_ctrl_334 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_335 <= 32'h0;
      end
  else if(pciephy_ctrl_335_we)
  begin
  reg_pciephy_ctrl_335 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_336 <= 32'h0;
      end
  else if(pciephy_ctrl_336_we)
  begin
  reg_pciephy_ctrl_336 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_337 <= 32'h0;
      end
  else if(pciephy_ctrl_337_we)
  begin
  reg_pciephy_ctrl_337 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_338 <= 32'h0;
      end
  else if(pciephy_ctrl_338_we)
  begin
  reg_pciephy_ctrl_338 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_339 <= 32'h0;
      end
  else if(pciephy_ctrl_339_we)
  begin
  reg_pciephy_ctrl_339 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_340 <= 32'h0;
      end
  else if(pciephy_ctrl_340_we)
  begin
  reg_pciephy_ctrl_340 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_341 <= 32'h0;
      end
  else if(pciephy_ctrl_341_we)
  begin
  reg_pciephy_ctrl_341 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_342 <= 32'h0;
      end
  else if(pciephy_ctrl_342_we)
  begin
  reg_pciephy_ctrl_342 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_343 <= 32'h0;
      end
  else if(pciephy_ctrl_343_we)
  begin
  reg_pciephy_ctrl_343 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_344 <= 32'h0;
      end
  else if(pciephy_ctrl_344_we)
  begin
  reg_pciephy_ctrl_344 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_345 <= 32'h0;
      end
  else if(pciephy_ctrl_345_we)
  begin
  reg_pciephy_ctrl_345 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_346 <= 32'h0;
      end
  else if(pciephy_ctrl_346_we)
  begin
  reg_pciephy_ctrl_346 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_347 <= 32'h0;
      end
  else if(pciephy_ctrl_347_we)
  begin
  reg_pciephy_ctrl_347 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_348 <= 32'h0;
      end
  else if(pciephy_ctrl_348_we)
  begin
  reg_pciephy_ctrl_348 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_349 <= 32'h0;
      end
  else if(pciephy_ctrl_349_we)
  begin
  reg_pciephy_ctrl_349 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_350 <= 32'h0;
      end
  else if(pciephy_ctrl_350_we)
  begin
  reg_pciephy_ctrl_350 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_351 <= 32'h0;
      end
  else if(pciephy_ctrl_351_we)
  begin
  reg_pciephy_ctrl_351 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_352 <= 32'h0;
      end
  else if(pciephy_ctrl_352_we)
  begin
  reg_pciephy_ctrl_352 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_353 <= 32'h0;
      end
  else if(pciephy_ctrl_353_we)
  begin
  reg_pciephy_ctrl_353 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_354 <= 32'h0;
      end
  else if(pciephy_ctrl_354_we)
  begin
  reg_pciephy_ctrl_354 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_355 <= 32'h0;
      end
  else if(pciephy_ctrl_355_we)
  begin
  reg_pciephy_ctrl_355 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_356 <= 32'h0;
      end
  else if(pciephy_ctrl_356_we)
  begin
  reg_pciephy_ctrl_356 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_357 <= 32'h0;
      end
  else if(pciephy_ctrl_357_we)
  begin
  reg_pciephy_ctrl_357 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_358 <= 32'h0;
      end
  else if(pciephy_ctrl_358_we)
  begin
  reg_pciephy_ctrl_358 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_359 <= 32'h0;
      end
  else if(pciephy_ctrl_359_we)
  begin
  reg_pciephy_ctrl_359 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_360 <= 32'h0;
      end
  else if(pciephy_ctrl_360_we)
  begin
  reg_pciephy_ctrl_360 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_361 <= 32'h0;
      end
  else if(pciephy_ctrl_361_we)
  begin
  reg_pciephy_ctrl_361 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_362 <= 32'h0;
      end
  else if(pciephy_ctrl_362_we)
  begin
  reg_pciephy_ctrl_362 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_363 <= 32'h0;
      end
  else if(pciephy_ctrl_363_we)
  begin
  reg_pciephy_ctrl_363 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_364 <= 32'h0;
      end
  else if(pciephy_ctrl_364_we)
  begin
  reg_pciephy_ctrl_364 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_365 <= 32'h0;
      end
  else if(pciephy_ctrl_365_we)
  begin
  reg_pciephy_ctrl_365 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_366 <= 32'h0;
      end
  else if(pciephy_ctrl_366_we)
  begin
  reg_pciephy_ctrl_366 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_367 <= 32'h0;
      end
  else if(pciephy_ctrl_367_we)
  begin
  reg_pciephy_ctrl_367 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_368 <= 32'h0;
      end
  else if(pciephy_ctrl_368_we)
  begin
  reg_pciephy_ctrl_368 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_369 <= 32'h0;
      end
  else if(pciephy_ctrl_369_we)
  begin
  reg_pciephy_ctrl_369 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_370 <= 32'h0;
      end
  else if(pciephy_ctrl_370_we)
  begin
  reg_pciephy_ctrl_370 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_371 <= 32'h0;
      end
  else if(pciephy_ctrl_371_we)
  begin
  reg_pciephy_ctrl_371 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_372 <= 32'h0;
      end
  else if(pciephy_ctrl_372_we)
  begin
  reg_pciephy_ctrl_372 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_373 <= 32'h0;
      end
  else if(pciephy_ctrl_373_we)
  begin
  reg_pciephy_ctrl_373 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_374 <= 32'h0;
      end
  else if(pciephy_ctrl_374_we)
  begin
  reg_pciephy_ctrl_374 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_375 <= 32'h0;
      end
  else if(pciephy_ctrl_375_we)
  begin
  reg_pciephy_ctrl_375 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_376 <= 32'h0;
      end
  else if(pciephy_ctrl_376_we)
  begin
  reg_pciephy_ctrl_376 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_377 <= 32'h0;
      end
  else if(pciephy_ctrl_377_we)
  begin
  reg_pciephy_ctrl_377 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_378 <= 32'h0;
      end
  else if(pciephy_ctrl_378_we)
  begin
  reg_pciephy_ctrl_378 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_379 <= 32'h0;
      end
  else if(pciephy_ctrl_379_we)
  begin
  reg_pciephy_ctrl_379 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_380 <= 32'h0;
      end
  else if(pciephy_ctrl_380_we)
  begin
  reg_pciephy_ctrl_380 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_381 <= 32'h0;
      end
  else if(pciephy_ctrl_381_we)
  begin
  reg_pciephy_ctrl_381 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_382 <= 32'h0;
      end
  else if(pciephy_ctrl_382_we)
  begin
  reg_pciephy_ctrl_382 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_383 <= 32'h0;
      end
  else if(pciephy_ctrl_383_we)
  begin
  reg_pciephy_ctrl_383 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_384 <= 32'h0;
      end
  else if(pciephy_ctrl_384_we)
  begin
  reg_pciephy_ctrl_384 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_385 <= 32'h0;
      end
  else if(pciephy_ctrl_385_we)
  begin
  reg_pciephy_ctrl_385 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_386 <= 32'h0;
      end
  else if(pciephy_ctrl_386_we)
  begin
  reg_pciephy_ctrl_386 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_387 <= 32'h0;
      end
  else if(pciephy_ctrl_387_we)
  begin
  reg_pciephy_ctrl_387 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_388 <= 32'h0;
      end
  else if(pciephy_ctrl_388_we)
  begin
  reg_pciephy_ctrl_388 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_389 <= 32'h0;
      end
  else if(pciephy_ctrl_389_we)
  begin
  reg_pciephy_ctrl_389 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_390 <= 32'h0;
      end
  else if(pciephy_ctrl_390_we)
  begin
  reg_pciephy_ctrl_390 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_391 <= 32'h0;
      end
  else if(pciephy_ctrl_391_we)
  begin
  reg_pciephy_ctrl_391 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_392 <= 32'h0;
      end
  else if(pciephy_ctrl_392_we)
  begin
  reg_pciephy_ctrl_392 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_393 <= 32'h0;
      end
  else if(pciephy_ctrl_393_we)
  begin
  reg_pciephy_ctrl_393 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_394 <= 32'h0;
      end
  else if(pciephy_ctrl_394_we)
  begin
  reg_pciephy_ctrl_394 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_395 <= 32'h0;
      end
  else if(pciephy_ctrl_395_we)
  begin
  reg_pciephy_ctrl_395 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_396 <= 32'h0;
      end
  else if(pciephy_ctrl_396_we)
  begin
  reg_pciephy_ctrl_396 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_397 <= 32'h0;
      end
  else if(pciephy_ctrl_397_we)
  begin
  reg_pciephy_ctrl_397 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_398 <= 32'h0;
      end
  else if(pciephy_ctrl_398_we)
  begin
  reg_pciephy_ctrl_398 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_399 <= 32'h0;
      end
  else if(pciephy_ctrl_399_we)
  begin
  reg_pciephy_ctrl_399 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_400 <= 32'h0;
      end
  else if(pciephy_ctrl_400_we)
  begin
  reg_pciephy_ctrl_400 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_401 <= 32'h0;
      end
  else if(pciephy_ctrl_401_we)
  begin
  reg_pciephy_ctrl_401 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_402 <= 32'h0;
      end
  else if(pciephy_ctrl_402_we)
  begin
  reg_pciephy_ctrl_402 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_403 <= 32'h0;
      end
  else if(pciephy_ctrl_403_we)
  begin
  reg_pciephy_ctrl_403 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_404 <= 32'h0;
      end
  else if(pciephy_ctrl_404_we)
  begin
  reg_pciephy_ctrl_404 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_405 <= 32'h0;
      end
  else if(pciephy_ctrl_405_we)
  begin
  reg_pciephy_ctrl_405 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_406 <= 32'h0;
      end
  else if(pciephy_ctrl_406_we)
  begin
  reg_pciephy_ctrl_406 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_407 <= 32'h0;
      end
  else if(pciephy_ctrl_407_we)
  begin
  reg_pciephy_ctrl_407 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_408 <= 32'h0;
      end
  else if(pciephy_ctrl_408_we)
  begin
  reg_pciephy_ctrl_408 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_409 <= 32'h0;
      end
  else if(pciephy_ctrl_409_we)
  begin
  reg_pciephy_ctrl_409 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_410 <= 32'h0;
      end
  else if(pciephy_ctrl_410_we)
  begin
  reg_pciephy_ctrl_410 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_411 <= 32'h0;
      end
  else if(pciephy_ctrl_411_we)
  begin
  reg_pciephy_ctrl_411 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_412 <= 32'h0;
      end
  else if(pciephy_ctrl_412_we)
  begin
  reg_pciephy_ctrl_412 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_413 <= 32'h0;
      end
  else if(pciephy_ctrl_413_we)
  begin
  reg_pciephy_ctrl_413 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_414 <= 32'h0;
      end
  else if(pciephy_ctrl_414_we)
  begin
  reg_pciephy_ctrl_414 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_415 <= 32'h0;
      end
  else if(pciephy_ctrl_415_we)
  begin
  reg_pciephy_ctrl_415 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_416 <= 32'h0;
      end
  else if(pciephy_ctrl_416_we)
  begin
  reg_pciephy_ctrl_416 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_417 <= 32'h0;
      end
  else if(pciephy_ctrl_417_we)
  begin
  reg_pciephy_ctrl_417 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_418 <= 32'h0;
      end
  else if(pciephy_ctrl_418_we)
  begin
  reg_pciephy_ctrl_418 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_419 <= 32'h0;
      end
  else if(pciephy_ctrl_419_we)
  begin
  reg_pciephy_ctrl_419 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_420 <= 32'h0;
      end
  else if(pciephy_ctrl_420_we)
  begin
  reg_pciephy_ctrl_420 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_421 <= 32'h0;
      end
  else if(pciephy_ctrl_421_we)
  begin
  reg_pciephy_ctrl_421 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_422 <= 32'h0;
      end
  else if(pciephy_ctrl_422_we)
  begin
  reg_pciephy_ctrl_422 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_423 <= 32'h0;
      end
  else if(pciephy_ctrl_423_we)
  begin
  reg_pciephy_ctrl_423 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_424 <= 32'h0;
      end
  else if(pciephy_ctrl_424_we)
  begin
  reg_pciephy_ctrl_424 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_425 <= 32'h0;
      end
  else if(pciephy_ctrl_425_we)
  begin
  reg_pciephy_ctrl_425 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_426 <= 32'h0;
      end
  else if(pciephy_ctrl_426_we)
  begin
  reg_pciephy_ctrl_426 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_427 <= 32'h0;
      end
  else if(pciephy_ctrl_427_we)
  begin
  reg_pciephy_ctrl_427 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_428 <= 32'h0;
      end
  else if(pciephy_ctrl_428_we)
  begin
  reg_pciephy_ctrl_428 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_429 <= 32'h0;
      end
  else if(pciephy_ctrl_429_we)
  begin
  reg_pciephy_ctrl_429 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_430 <= 32'h0;
      end
  else if(pciephy_ctrl_430_we)
  begin
  reg_pciephy_ctrl_430 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_431 <= 32'h0;
      end
  else if(pciephy_ctrl_431_we)
  begin
  reg_pciephy_ctrl_431 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_432 <= 32'h0;
      end
  else if(pciephy_ctrl_432_we)
  begin
  reg_pciephy_ctrl_432 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_433 <= 32'h0;
      end
  else if(pciephy_ctrl_433_we)
  begin
  reg_pciephy_ctrl_433 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_434 <= 32'h0;
      end
  else if(pciephy_ctrl_434_we)
  begin
  reg_pciephy_ctrl_434 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_435 <= 32'h0;
      end
  else if(pciephy_ctrl_435_we)
  begin
  reg_pciephy_ctrl_435 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_436 <= 32'h0;
      end
  else if(pciephy_ctrl_436_we)
  begin
  reg_pciephy_ctrl_436 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_437 <= 32'h0;
      end
  else if(pciephy_ctrl_437_we)
  begin
  reg_pciephy_ctrl_437 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_438 <= 32'h0;
      end
  else if(pciephy_ctrl_438_we)
  begin
  reg_pciephy_ctrl_438 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_439 <= 32'h0;
      end
  else if(pciephy_ctrl_439_we)
  begin
  reg_pciephy_ctrl_439 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_440 <= 32'h0;
      end
  else if(pciephy_ctrl_440_we)
  begin
  reg_pciephy_ctrl_440 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_441 <= 32'h0;
      end
  else if(pciephy_ctrl_441_we)
  begin
  reg_pciephy_ctrl_441 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_442 <= 32'h0;
      end
  else if(pciephy_ctrl_442_we)
  begin
  reg_pciephy_ctrl_442 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_443 <= 32'h0;
      end
  else if(pciephy_ctrl_443_we)
  begin
  reg_pciephy_ctrl_443 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_444 <= 32'h0;
      end
  else if(pciephy_ctrl_444_we)
  begin
  reg_pciephy_ctrl_444 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_445 <= 32'h0;
      end
  else if(pciephy_ctrl_445_we)
  begin
  reg_pciephy_ctrl_445 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_446 <= 32'h0;
      end
  else if(pciephy_ctrl_446_we)
  begin
  reg_pciephy_ctrl_446 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_447 <= 32'h0;
      end
  else if(pciephy_ctrl_447_we)
  begin
  reg_pciephy_ctrl_447 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_448 <= 32'h0;
      end
  else if(pciephy_ctrl_448_we)
  begin
  reg_pciephy_ctrl_448 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_449 <= 32'h0;
      end
  else if(pciephy_ctrl_449_we)
  begin
  reg_pciephy_ctrl_449 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_450 <= 32'h0;
      end
  else if(pciephy_ctrl_450_we)
  begin
  reg_pciephy_ctrl_450 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_451 <= 32'h0;
      end
  else if(pciephy_ctrl_451_we)
  begin
  reg_pciephy_ctrl_451 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_452 <= 32'h0;
      end
  else if(pciephy_ctrl_452_we)
  begin
  reg_pciephy_ctrl_452 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_453 <= 32'h0;
      end
  else if(pciephy_ctrl_453_we)
  begin
  reg_pciephy_ctrl_453 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_454 <= 32'h0;
      end
  else if(pciephy_ctrl_454_we)
  begin
  reg_pciephy_ctrl_454 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_455 <= 32'h0;
      end
  else if(pciephy_ctrl_455_we)
  begin
  reg_pciephy_ctrl_455 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_456 <= 32'h0;
      end
  else if(pciephy_ctrl_456_we)
  begin
  reg_pciephy_ctrl_456 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_457 <= 32'h0;
      end
  else if(pciephy_ctrl_457_we)
  begin
  reg_pciephy_ctrl_457 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_458 <= 32'h0;
      end
  else if(pciephy_ctrl_458_we)
  begin
  reg_pciephy_ctrl_458 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_459 <= 32'h0;
      end
  else if(pciephy_ctrl_459_we)
  begin
  reg_pciephy_ctrl_459 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_460 <= 32'h0;
      end
  else if(pciephy_ctrl_460_we)
  begin
  reg_pciephy_ctrl_460 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_461 <= 32'h0;
      end
  else if(pciephy_ctrl_461_we)
  begin
  reg_pciephy_ctrl_461 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_462 <= 32'h0;
      end
  else if(pciephy_ctrl_462_we)
  begin
  reg_pciephy_ctrl_462 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_463 <= 32'h0;
      end
  else if(pciephy_ctrl_463_we)
  begin
  reg_pciephy_ctrl_463 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_464 <= 32'h0;
      end
  else if(pciephy_ctrl_464_we)
  begin
  reg_pciephy_ctrl_464 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_465 <= 32'h0;
      end
  else if(pciephy_ctrl_465_we)
  begin
  reg_pciephy_ctrl_465 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_466 <= 32'h0;
      end
  else if(pciephy_ctrl_466_we)
  begin
  reg_pciephy_ctrl_466 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_467 <= 32'h0;
      end
  else if(pciephy_ctrl_467_we)
  begin
  reg_pciephy_ctrl_467 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_468 <= 32'h0;
      end
  else if(pciephy_ctrl_468_we)
  begin
  reg_pciephy_ctrl_468 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_469 <= 32'h0;
      end
  else if(pciephy_ctrl_469_we)
  begin
  reg_pciephy_ctrl_469 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_470 <= 32'h0;
      end
  else if(pciephy_ctrl_470_we)
  begin
  reg_pciephy_ctrl_470 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_471 <= 32'h0;
      end
  else if(pciephy_ctrl_471_we)
  begin
  reg_pciephy_ctrl_471 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_472 <= 32'h0;
      end
  else if(pciephy_ctrl_472_we)
  begin
  reg_pciephy_ctrl_472 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_473 <= 32'h0;
      end
  else if(pciephy_ctrl_473_we)
  begin
  reg_pciephy_ctrl_473 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_474 <= 32'h0;
      end
  else if(pciephy_ctrl_474_we)
  begin
  reg_pciephy_ctrl_474 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_475 <= 32'h0;
      end
  else if(pciephy_ctrl_475_we)
  begin
  reg_pciephy_ctrl_475 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_476 <= 32'h0;
      end
  else if(pciephy_ctrl_476_we)
  begin
  reg_pciephy_ctrl_476 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_477 <= 32'h0;
      end
  else if(pciephy_ctrl_477_we)
  begin
  reg_pciephy_ctrl_477 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_478 <= 32'h0;
      end
  else if(pciephy_ctrl_478_we)
  begin
  reg_pciephy_ctrl_478 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_479 <= 32'h0;
      end
  else if(pciephy_ctrl_479_we)
  begin
  reg_pciephy_ctrl_479 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_480 <= 32'h0;
      end
  else if(pciephy_ctrl_480_we)
  begin
  reg_pciephy_ctrl_480 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_481 <= 32'h0;
      end
  else if(pciephy_ctrl_481_we)
  begin
  reg_pciephy_ctrl_481 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_482 <= 32'h0;
      end
  else if(pciephy_ctrl_482_we)
  begin
  reg_pciephy_ctrl_482 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_483 <= 32'h0;
      end
  else if(pciephy_ctrl_483_we)
  begin
  reg_pciephy_ctrl_483 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_484 <= 32'h0;
      end
  else if(pciephy_ctrl_484_we)
  begin
  reg_pciephy_ctrl_484 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_485 <= 32'h0;
      end
  else if(pciephy_ctrl_485_we)
  begin
  reg_pciephy_ctrl_485 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_486 <= 32'h0;
      end
  else if(pciephy_ctrl_486_we)
  begin
  reg_pciephy_ctrl_486 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_487 <= 32'h0;
      end
  else if(pciephy_ctrl_487_we)
  begin
  reg_pciephy_ctrl_487 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_488 <= 32'h0;
      end
  else if(pciephy_ctrl_488_we)
  begin
  reg_pciephy_ctrl_488 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_489 <= 32'h0;
      end
  else if(pciephy_ctrl_489_we)
  begin
  reg_pciephy_ctrl_489 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_490 <= 32'h0;
      end
  else if(pciephy_ctrl_490_we)
  begin
  reg_pciephy_ctrl_490 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_491 <= 32'h0;
      end
  else if(pciephy_ctrl_491_we)
  begin
  reg_pciephy_ctrl_491 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_492 <= 32'h0;
      end
  else if(pciephy_ctrl_492_we)
  begin
  reg_pciephy_ctrl_492 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_493 <= 32'h0;
      end
  else if(pciephy_ctrl_493_we)
  begin
  reg_pciephy_ctrl_493 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_494 <= 32'h0;
      end
  else if(pciephy_ctrl_494_we)
  begin
  reg_pciephy_ctrl_494 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_495 <= 32'h0;
      end
  else if(pciephy_ctrl_495_we)
  begin
  reg_pciephy_ctrl_495 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_496 <= 32'h0;
      end
  else if(pciephy_ctrl_496_we)
  begin
  reg_pciephy_ctrl_496 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_497 <= 32'h0;
      end
  else if(pciephy_ctrl_497_we)
  begin
  reg_pciephy_ctrl_497 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_498 <= 32'h0;
      end
  else if(pciephy_ctrl_498_we)
  begin
  reg_pciephy_ctrl_498 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_499 <= 32'h0;
      end
  else if(pciephy_ctrl_499_we)
  begin
  reg_pciephy_ctrl_499 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_500 <= 32'h0;
      end
  else if(pciephy_ctrl_500_we)
  begin
  reg_pciephy_ctrl_500 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_501 <= 32'h0;
      end
  else if(pciephy_ctrl_501_we)
  begin
  reg_pciephy_ctrl_501 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_502 <= 32'h0;
      end
  else if(pciephy_ctrl_502_we)
  begin
  reg_pciephy_ctrl_502 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_503 <= 32'h0;
      end
  else if(pciephy_ctrl_503_we)
  begin
  reg_pciephy_ctrl_503 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_504 <= 32'h0;
      end
  else if(pciephy_ctrl_504_we)
  begin
  reg_pciephy_ctrl_504 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_505 <= 32'h0;
      end
  else if(pciephy_ctrl_505_we)
  begin
  reg_pciephy_ctrl_505 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_506 <= 32'h0;
      end
  else if(pciephy_ctrl_506_we)
  begin
  reg_pciephy_ctrl_506 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_507 <= 32'h0;
      end
  else if(pciephy_ctrl_507_we)
  begin
  reg_pciephy_ctrl_507 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_508 <= 32'h0;
      end
  else if(pciephy_ctrl_508_we)
  begin
  reg_pciephy_ctrl_508 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_509 <= 32'h0;
      end
  else if(pciephy_ctrl_509_we)
  begin
  reg_pciephy_ctrl_509 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_510 <= 32'h0;
      end
  else if(pciephy_ctrl_510_we)
  begin
  reg_pciephy_ctrl_510 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_511 <= 32'h0;
      end
  else if(pciephy_ctrl_511_we)
  begin
  reg_pciephy_ctrl_511 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_512 <= 32'h0;
      end
  else if(pciephy_ctrl_512_we)
  begin
  reg_pciephy_ctrl_512 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_513 <= 32'h0;
      end
  else if(pciephy_ctrl_513_we)
  begin
  reg_pciephy_ctrl_513 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_514 <= 32'h0;
      end
  else if(pciephy_ctrl_514_we)
  begin
  reg_pciephy_ctrl_514 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_515 <= 32'h0;
      end
  else if(pciephy_ctrl_515_we)
  begin
  reg_pciephy_ctrl_515 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_516 <= 32'h0;
      end
  else if(pciephy_ctrl_516_we)
  begin
  reg_pciephy_ctrl_516 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_517 <= 32'h0;
      end
  else if(pciephy_ctrl_517_we)
  begin
  reg_pciephy_ctrl_517 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_518 <= 32'h0;
      end
  else if(pciephy_ctrl_518_we)
  begin
  reg_pciephy_ctrl_518 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_519 <= 32'h0;
      end
  else if(pciephy_ctrl_519_we)
  begin
  reg_pciephy_ctrl_519 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_520 <= 32'h0;
      end
  else if(pciephy_ctrl_520_we)
  begin
  reg_pciephy_ctrl_520 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_521 <= 32'h0;
      end
  else if(pciephy_ctrl_521_we)
  begin
  reg_pciephy_ctrl_521 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_522 <= 32'h0;
      end
  else if(pciephy_ctrl_522_we)
  begin
  reg_pciephy_ctrl_522 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_523 <= 32'h0;
      end
  else if(pciephy_ctrl_523_we)
  begin
  reg_pciephy_ctrl_523 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_524 <= 32'h0;
      end
  else if(pciephy_ctrl_524_we)
  begin
  reg_pciephy_ctrl_524 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_525 <= 32'h0;
      end
  else if(pciephy_ctrl_525_we)
  begin
  reg_pciephy_ctrl_525 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_526 <= 32'h0;
      end
  else if(pciephy_ctrl_526_we)
  begin
  reg_pciephy_ctrl_526 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_527 <= 32'h0;
      end
  else if(pciephy_ctrl_527_we)
  begin
  reg_pciephy_ctrl_527 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_528 <= 32'h0;
      end
  else if(pciephy_ctrl_528_we)
  begin
  reg_pciephy_ctrl_528 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_529 <= 32'h0;
      end
  else if(pciephy_ctrl_529_we)
  begin
  reg_pciephy_ctrl_529 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_530 <= 32'h0;
      end
  else if(pciephy_ctrl_530_we)
  begin
  reg_pciephy_ctrl_530 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_531 <= 32'h0;
      end
  else if(pciephy_ctrl_531_we)
  begin
  reg_pciephy_ctrl_531 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_532 <= 32'h0;
      end
  else if(pciephy_ctrl_532_we)
  begin
  reg_pciephy_ctrl_532 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_533 <= 32'h0;
      end
  else if(pciephy_ctrl_533_we)
  begin
  reg_pciephy_ctrl_533 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_534 <= 32'h0;
      end
  else if(pciephy_ctrl_534_we)
  begin
  reg_pciephy_ctrl_534 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_535 <= 32'h0;
      end
  else if(pciephy_ctrl_535_we)
  begin
  reg_pciephy_ctrl_535 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_536 <= 32'h0;
      end
  else if(pciephy_ctrl_536_we)
  begin
  reg_pciephy_ctrl_536 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_537 <= 32'h0;
      end
  else if(pciephy_ctrl_537_we)
  begin
  reg_pciephy_ctrl_537 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_538 <= 32'h0;
      end
  else if(pciephy_ctrl_538_we)
  begin
  reg_pciephy_ctrl_538 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_539 <= 32'h0;
      end
  else if(pciephy_ctrl_539_we)
  begin
  reg_pciephy_ctrl_539 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_540 <= 32'h0;
      end
  else if(pciephy_ctrl_540_we)
  begin
  reg_pciephy_ctrl_540 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_541 <= 32'h0;
      end
  else if(pciephy_ctrl_541_we)
  begin
  reg_pciephy_ctrl_541 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_542 <= 32'h0;
      end
  else if(pciephy_ctrl_542_we)
  begin
  reg_pciephy_ctrl_542 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_543 <= 32'h0;
      end
  else if(pciephy_ctrl_543_we)
  begin
  reg_pciephy_ctrl_543 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_544 <= 32'h0;
      end
  else if(pciephy_ctrl_544_we)
  begin
  reg_pciephy_ctrl_544 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_545 <= 32'h0;
      end
  else if(pciephy_ctrl_545_we)
  begin
  reg_pciephy_ctrl_545 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_546 <= 32'h0;
      end
  else if(pciephy_ctrl_546_we)
  begin
  reg_pciephy_ctrl_546 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_547 <= 32'h0;
      end
  else if(pciephy_ctrl_547_we)
  begin
  reg_pciephy_ctrl_547 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_548 <= 32'h0;
      end
  else if(pciephy_ctrl_548_we)
  begin
  reg_pciephy_ctrl_548 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_549 <= 32'h0;
      end
  else if(pciephy_ctrl_549_we)
  begin
  reg_pciephy_ctrl_549 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_550 <= 32'h0;
      end
  else if(pciephy_ctrl_550_we)
  begin
  reg_pciephy_ctrl_550 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_551 <= 32'h0;
      end
  else if(pciephy_ctrl_551_we)
  begin
  reg_pciephy_ctrl_551 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_552 <= 32'h0;
      end
  else if(pciephy_ctrl_552_we)
  begin
  reg_pciephy_ctrl_552 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_553 <= 32'h0;
      end
  else if(pciephy_ctrl_553_we)
  begin
  reg_pciephy_ctrl_553 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_554 <= 32'h0;
      end
  else if(pciephy_ctrl_554_we)
  begin
  reg_pciephy_ctrl_554 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_555 <= 32'h0;
      end
  else if(pciephy_ctrl_555_we)
  begin
  reg_pciephy_ctrl_555 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_556 <= 32'h0;
      end
  else if(pciephy_ctrl_556_we)
  begin
  reg_pciephy_ctrl_556 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_557 <= 32'h0;
      end
  else if(pciephy_ctrl_557_we)
  begin
  reg_pciephy_ctrl_557 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_558 <= 32'h0;
      end
  else if(pciephy_ctrl_558_we)
  begin
  reg_pciephy_ctrl_558 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_559 <= 32'h0;
      end
  else if(pciephy_ctrl_559_we)
  begin
  reg_pciephy_ctrl_559 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_560 <= 32'h0;
      end
  else if(pciephy_ctrl_560_we)
  begin
  reg_pciephy_ctrl_560 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_561 <= 32'h0;
      end
  else if(pciephy_ctrl_561_we)
  begin
  reg_pciephy_ctrl_561 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_562 <= 32'h0;
      end
  else if(pciephy_ctrl_562_we)
  begin
  reg_pciephy_ctrl_562 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_563 <= 32'h0;
      end
  else if(pciephy_ctrl_563_we)
  begin
  reg_pciephy_ctrl_563 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

       if(!rst_b)
       begin
    reg_pciephy_ctrl_564 <= 32'h0;
      end
  else if(pciephy_ctrl_564_we)
  begin
  reg_pciephy_ctrl_564 <= reg_wdata;
  end
  

always @( posedge clk  or negedge rst_b )

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
