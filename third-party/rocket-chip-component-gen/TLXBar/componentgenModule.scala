package tssv.componentgen

import chisel3._
import org.chipsalliance.cde.config.Config
import org.chipsalliance.cde.config.Parameters
import freechips.rocketchip.diplomacy._
import freechips.rocketchip.subsystem._
import freechips.rocketchip.tilelink._
import chisel3.util.experimental.FlattenInstance

case class TLXBarComponentGenParams(
  moduleName: String,
  masters: Seq[TLMasterParameters], 
  beatBytes: Int,
  addrBits: Int,
  sourceBits: Int,
  sinkBits: Int,
  sizeBits: Int,
  slaves: Seq[TLSlaveParameters],
  slaveNames: Seq[String]) 

class TLXBarComponentGen(implicit p: Parameters) extends LazyModule {

  def mapMaster(m: TLMasterParameters): TLClientNode = {
    TLClientNode(
      List(
        TLMasterPortParameters.v2(
          Seq(m)
        )
      )
    )
  }
  val tlMasters = p(TLXBarComponentGenParamsKey).masters.map(mapMaster)

  def mapSlave(s: TLSlaveParameters): TLManagerNode = {
    TLManagerNode(
      Seq(
        TLSlavePortParameters.v1(
          managers = Seq(s),
          beatBytes = p(TLXBarComponentGenParamsKey).beatBytes
          )
    ))
  }
  val tlSlaves = p(TLXBarComponentGenParamsKey).slaves.map(mapSlave)

  // TL Crossbar
  val xbar = LazyModule(new TLXbar)

  // Connections
  tlMasters.map(xbar.node := _)
  tlSlaves.map(_ := xbar.node)

  override lazy val module = new TLXBarComponentGenModuleImp(this) {
    // Implement any additional logic here

    // Define the I/O bundle
    var tlParams =
      TLBundleParameters(
        addressBits = p(TLXBarComponentGenParamsKey).addrBits, 
        dataBits = p(TLXBarComponentGenParamsKey).beatBytes * 8, 
        sourceBits = p(TLXBarComponentGenParamsKey).sourceBits,
        sinkBits = p(TLXBarComponentGenParamsKey).sinkBits,
        sizeBits = p(TLXBarComponentGenParamsKey).sizeBits,
        echoFields     = Nil,
        requestFields  = Nil,
        responseFields = Nil,
        hasBCE = false
      )

    val IOMasters = p(TLXBarComponentGenParamsKey).masters.map(m => { 
      IO(Flipped(new TLBundle(tlParams))).suggestName(m.name) 
    })
    val IOSlaves = p(TLXBarComponentGenParamsKey).slaveNames.map(s => { 
      IO(new TLBundle(tlParams)).suggestName(s) 
    })

    // var (m1_bundle,m1_edge) = xbar.node.in(0)
    def bindMaster(i:Int) = { 
      tlMasters(i).out.head._1 <> IOMasters(i)
    }
    (0 to p(TLXBarComponentGenParamsKey).masters.size-1).toSeq.map(bindMaster)
 
    def bindSlave(i:Int) = { 
      tlSlaves(i).in.head._1 <> IOSlaves(i)
    }
    (0 to p(TLXBarComponentGenParamsKey).slaves.size-1).toSeq.map(bindSlave)

  }

  override lazy val desiredName =  p(TLXBarComponentGenParamsKey).moduleName

}

class TLXBarComponentGenModuleImp[+L <: TLXBarComponentGen](_outer: L)
    extends LazyModuleImp(_outer)
    with FlattenInstance
