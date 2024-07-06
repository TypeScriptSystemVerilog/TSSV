package tssv.componentgen

import chisel3._
import org.chipsalliance.cde.config.Config
import org.chipsalliance.cde.config.Parameters
import freechips.rocketchip.diplomacy._
import freechips.rocketchip.subsystem._
import freechips.rocketchip.amba.axi4._
import chisel3.util.experimental.FlattenInstance

case class MyAXISubsystemParams(
  moduleName: String,
  masters: Seq[AXI4MasterParameters], 
  beatBytes: Int,
  addrBits: Int,
  idBits: Int,
  slaves: Seq[AXI4SlaveParameters],
  slaveNames: Seq[String]) 

class MyAXISubsystem(implicit p: Parameters) extends LazyModule {

  def mapMaster(m: AXI4MasterParameters): AXI4MasterNode = {
    AXI4MasterNode(
      List(
        AXI4MasterPortParameters(
          Seq(m)
        )
      )
    )
  }
  val axiMasters = p(MyAXISubsystemParamsKey).masters.map(mapMaster)

  def mapSlave(s: AXI4SlaveParameters): AXI4SlaveNode = {
    AXI4SlaveNode(
      Seq(
        AXI4SlavePortParameters(
          slaves = Seq(s),
          beatBytes = p(MyAXISubsystemParamsKey).beatBytes
        )
      )
    )
  }
  val axiSlaves = p(MyAXISubsystemParamsKey).slaves.map(mapSlave)

  // AXI Crossbar
  val xbar = LazyModule(new AXI4Xbar)

  // Connections
  axiMasters.map(xbar.node := _)
  axiSlaves.map(_ := xbar.node)

  override lazy val module = new MyAXISubsystemModuleImp(this) {
    // Implement any additional logic here

    // Define the I/O bundle
    var axiParams =
      AXI4BundleParameters(
        addrBits = p(MyAXISubsystemParamsKey).addrBits, 
        dataBits = p(MyAXISubsystemParamsKey).beatBytes * 8, 
        idBits = p(MyAXISubsystemParamsKey).idBits
      )

    val IOMasters = p(MyAXISubsystemParamsKey).masters.map(m => { 
      IO(Flipped(new AXI4Bundle(axiParams))).suggestName(m.name) 
    })
    val IOSlaves = p(MyAXISubsystemParamsKey).slaveNames.map(s => { 
      IO(new AXI4Bundle(axiParams)).suggestName(s) 
    })

    // var (m1_bundle,m1_edge) = xbar.node.in(0)
    def bindMaster(i:Int) = { 
      axiMasters(i).out.head._1 <> IOMasters(i)
    }
    (0 to p(MyAXISubsystemParamsKey).masters.size-1).toSeq.map(bindMaster)
 
    def bindSlave(i:Int) = { 
      axiSlaves(i).in.head._1 <> IOSlaves(i)
    }
    (0 to p(MyAXISubsystemParamsKey).slaves.size-1).toSeq.map(bindSlave)

  }

  override lazy val desiredName =  p(MyAXISubsystemParamsKey).moduleName

}

class MyAXISubsystemModuleImp[+L <: MyAXISubsystem](_outer: L)
    extends LazyModuleImp(_outer)
    with FlattenInstance
